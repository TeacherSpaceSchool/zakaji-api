const express = require('express');
const router = express.Router();
const randomstring = require('randomstring');
const SubscriberZakaji = require('../models/subscriberZakaji');
const ClientZakaji = require('../models/clientZakaji');
const passportEngine = require('../module/passport');
const ModelsErrorZakaji = require('../models/errorZakaji');

router.post('/register', async (req, res) => {
    await passportEngine.getuser(req, res, async (user)=> {
        try {
            let subscriptionModel;
            let number = req.body.number
            subscriptionModel = await SubscriberZakaji.findOne({$or: [{number: number}, {endpoint: req.body.endpoint}]})
            if (subscriptionModel) {
                if (user) subscriptionModel.user = user._id
                subscriptionModel.endpoint = req.body.endpoint
                subscriptionModel.keys = req.body.keys
            }
            else {
                number = randomstring.generate({length: 20, charset: 'numeric'});
                while (await SubscriberZakaji.findOne({number: number}).select('_id').lean())
                    number = randomstring.generate({length: 20, charset: 'numeric'});
                subscriptionModel = new SubscriberZakaji({
                    endpoint: req.body.endpoint,
                    keys: req.body.keys,
                    number: number,
                });
                if (user) subscriptionModel.user = user._id
            }
            if (user.role === 'client') {
                let client = await ClientZakaji.findOne({user: user._id})
                client.notification = true
                await client.save()
            }
            subscriptionModel.save((err) => {
                if (err) {
                    console.error(`Error occurred while saving subscription. Err: ${err}`);
                    res.status(500).json({
                        error: 'Technical error occurred'
                    });
                } else {
                    console.log('Subscription saved');
                    res.send(subscriptionModel.number)
                }
            });
        } catch (err) {
            let _object = new ModelsErrorZakaji({
                err: err.message,
                path: 'register subscribe'
            });
            ModelsErrorZakaji.create(_object)
            console.error(err)
            res.status(501);
            res.end('error')
        }
    })
});

router.post('/unregister', async (req, res) => {
    try{
        let subscriptionModel = await SubscriberZakaji.findOne({number: req.body.number}).populate({ path: 'user'})
        if(subscriptionModel&&subscriptionModel.user&&subscriptionModel.user.role==='client'&&(await SubscriberZakaji.find({user: subscriptionModel.user._id}).select('_id').lean()).length===1){
            let client = await ClientZakaji.findOne({user: subscriptionModel.user._id})
            if(client) {
                client.notification = false
                await client.save()
            }
            subscriptionModel.user = null
            await subscriptionModel.save()
        }
    } catch (err) {
        let _object = new ModelsErrorZakaji({
            err: err.message,
            path: 'unregister subscribe'
        });
        ModelsErrorZakaji.create(_object)
        console.error(err)
        res.status(501);
        res.end('error')
    }
});

router.post('/delete', async (req, res) => {
    try{
        let subscriptionModel = await SubscriberZakaji.findOne({number: req.body.number}).populate({ path: 'user'}).lean()
        if(subscriptionModel&&subscriptionModel.user&&subscriptionModel.user.role==='client'&&(await SubscriberZakaji.find({user: subscriptionModel.user._id}).select('_id').lean()).length===1){
            let client = await ClientZakaji.findOne({user: subscriptionModel.user._id})
            if(client) {
                client.notification = false
                await client.save()
            }
        }
        await SubscriberZakaji.deleteMany({number: req.body.number})
    } catch (err) {
        let _object = new ModelsErrorZakaji({
            err: err.message,
            path: 'delete subscribe'
        });
        ModelsErrorZakaji.create(_object)
        console.error(err)
        res.status(501);
        res.end('error')
    }
});

router.get('/check', async(req, res) => {
    try{
        await SubscriberZakaji.findOne()
        res.status(200);
        res.end('ok')
    } catch (err) {
        console.error(err)
        res.status(501);
        res.end('error')
    }
});

module.exports = router;