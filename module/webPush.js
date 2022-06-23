const SubscriberZakaji = require('../models/subscriberZakaji');
const NotificationStatisticZakaji = require('../models/notificationStatisticZakaji');
const q = require('q');
const webPush = require('web-push');
const keys = require((process.env.URL).trim()==='https://zakaji.kg'?'./../config/keys_prod':'./../config/keys_dev');

module.exports.sendWebPush = async({title, message, tag, url, icon, user}) => {
    const payload = {
        title: title?title:title,
        message: message?message:message,
        url: url?url:'https://zakaji.kg',
        icon: icon?icon:'https://zakaji.kg/static/192x192.png',
        tag: tag?tag:'ZAKAJI.KG'
    };
    let _object = new NotificationStatisticZakaji({
        tag: payload.tag,
        url: payload.url,
        icon: payload.icon,
        title: payload.title,
        text: payload.message,
        delivered: 0,
        failed: 0,
    });
    _object = await NotificationStatisticZakaji.create(_object)
    payload._id = _object._id
    if(user==='all'){
        SubscriberZakaji.find({}, (err, subscriptions) => {
            if (err) {
                console.error('Error occurred while getting subscriptions');
            } else {
                let parallelSubscriberZakajiCalls = subscriptions.map((subscription) => {
                    return new Promise((resolve, reject) => {
                        const pushSubscriberZakaji = {
                            endpoint: subscription.endpoint,
                            keys: {
                                p256dh: subscription.keys.p256dh,
                                auth: subscription.keys.auth
                            }
                        };

                        const pushPayload = JSON.stringify(payload);
                        const pushOptions = {
                            vapidDetails: {
                                subject: 'https://zakaji.kg',
                                privateKey: keys.privateKey,
                                publicKey: keys.publicKey
                            },
                            headers: {}
                        };
                        webPush.sendNotification(
                            pushSubscriberZakaji,
                            pushPayload,
                            pushOptions
                        ).then((value) => {
                            resolve({
                                status: true,
                                endpoint: subscription.endpoint,
                                data: value
                            });
                        }).catch((err) => {
                            reject({
                                status: false,
                                endpoint: subscription.endpoint,
                                data: err
                            });
                        });
                    });
                });
                q.allSettled(parallelSubscriberZakajiCalls).then(async(pushResults) => {
                    try{
                        let delivered = 0;
                        let failed = 0;
                        for(let i=0; i<pushResults.length; i++){
                            if(pushResults[i].state === 'rejected'||pushResults[i].reason)
                                failed+=1
                            else
                                delivered += 1
                        }
                        _object.delivered = delivered
                        _object.failed = failed
                        await _object.save()
                    } catch (err) {
                        console.error(err)
                    }
                });
            }
        }).lean();
    }
    else {
        SubscriberZakaji.find({user: user}, (err, subscriptions) => {
            if (err) {
                console.error('Error occurred while getting subscriptions');
            } else {
                let parallelSubscriberZakajiCalls = subscriptions.map((subscription) => {
                    return new Promise((resolve, reject) => {
                        const pushSubscriberZakaji = {
                            endpoint: subscription.endpoint,
                            keys: {
                                p256dh: subscription.keys.p256dh,
                                auth: subscription.keys.auth
                            }
                        };

                        const pushPayload = JSON.stringify(payload);
                        const pushOptions = {
                            vapidDetails: {
                                subject: 'https://zakaji.kg',
                                privateKey: keys.privateKey,
                                publicKey: keys.publicKey
                            },
                            headers: {}
                        };
                        webPush.sendNotification(
                            pushSubscriberZakaji,
                            pushPayload,
                            pushOptions
                        ).then((value) => {
                            resolve({
                                status: true,
                                endpoint: subscription.endpoint,
                                data: value
                            });
                        }).catch((err) => {
                            reject({
                                status: false,
                                endpoint: subscription.endpoint,
                                data: err
                            });
                        });
                    });
                });
                q.allSettled(parallelSubscriberZakajiCalls).then(async (pushResults) => {
                    try{
                        let delivered = 0;
                        let failed = 0;
                        for(let i=0; i<pushResults.length; i++){
                            if(pushResults[i].state === 'rejected'||pushResults[i].reason)
                                failed+=1
                            else
                                delivered += 1
                        }
                        _object.delivered = delivered
                        _object.failed = failed
                        await _object.save()
                    } catch (err) {
                        console.error(err)
                    }
                });
            }
        }).lean();
    }

 }
