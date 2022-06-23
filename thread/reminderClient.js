const { isMainThread } = require('worker_threads');
const connectDB = require('../models/index');
const {sendWebPush} = require('../module/webPush');
const cron = require('node-cron');
const ModelsErrorZakaji = require('../models/errorZakaji');
connectDB.connect()
if(!isMainThread) {
    cron.schedule('1 20 * * 1,3,5', async() => {
        try{
            sendWebPush({title: 'ZAKAJI.KG', message: 'Не забудьте сделать свой заказ', user: 'all'})
        } catch (err) {
            let _object = new ModelsErrorZakaji({
                err: err.message,
                path: 'reminderClient thread'
            });
            ModelsErrorZakaji.create(_object)
            console.error(err)
        }
    });
}