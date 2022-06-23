const { isMainThread } = require('worker_threads');
const connectDB = require('../models/index');
const { reductionOutAdsXMLZakaji, setSingleOutXMLZakaji } = require('../module/singleOutXMLZakaji');
const { checkAdss } = require('../graphql/adsZakaji');
const OrganizationZakaji = require('../models/organizationZakaji');
const InvoiceZakaji = require('../models/invoiceZakaji');
const AdsZakaji = require('../models/adsZakaji');
const OrderZakaji = require('../models/orderZakaji');
const cron = require('node-cron');
const ModelsErrorZakaji = require('../models/errorZakaji');
const SingleOutXMLZakaji = require('../models/singleOutXMLZakaji');
const SingleOutXMLReturnedZakaji = require('../models/singleOutXMLReturnedZakaji');
const OutXMLShoroZakaji = require('../models/integrate/shoro/outXMLShoroZakaji');
const OutXMLReturnedShoroZakaji = require('../models/integrate/shoro/outXMLReturnedShoroZakaji');
const { pubsub } = require('../graphql/index');
const RELOAD_ORDER = 'RELOAD_ORDER';

connectDB.connect()
if(!isMainThread) {
    cron.schedule('1 3 * * *', async() => {
        try{
            let dateStart = new Date()
            dateStart.setHours(3, 0, 0, 0)
            dateStart.setDate(dateStart.getDate() - 1)
            let dateEnd = new Date(dateStart)
            dateEnd.setDate(dateEnd.getDate() + 1)
            let organizations = await OrganizationZakaji.find({
                autoAccept: true
            }).distinct('_id').lean()
            let orders = await InvoiceZakaji.find({
                del: {$ne: 'deleted'},
                taken: {$ne: true},
                cancelClient: null,
                cancelForwarder: null,
                $and: [{createdAt: {$gte: dateStart}}, {createdAt: {$lt: dateEnd}}],
                organization: {$in: organizations}
            })
            //.select('client organization orders dateDelivery paymentMethod number _id inv')
                .populate({
                    path: 'client',
                    //  select: '_id'
                })
                .populate({
                    path: 'organization',
                    //   select: '_id pass'
                })
                .populate({
                    path: 'orders',
                    //  select: '_id item count returned allPrice ',
                    populate: {
                        path: 'item',
                        //    select: '_id priotiry packaging'
                    }
                })
                .populate({path: 'agent'})
                .populate({path: 'provider'})
                .populate({path: 'sale'})
                .populate({path: 'forwarder'})

            for(let i = 0; i<orders.length;i++) {
                orders[i].taken = true
                await OrderZakaji.updateMany({_id: {$in: orders[i].orders.map(element=>element._id)}}, {status: 'принят'})
                orders[i].adss = await checkAdss(orders[i])
                if(orders[i].organization.pass&&orders[i].organization.pass.length){
                    orders[i].sync = await setSingleOutXMLZakaji(orders[i])
                }
                await orders[i].save()
                orders[i].adss = await AdsZakaji.find({_id: {$in: orders[i].adss}})
                pubsub.publish(RELOAD_ORDER, { reloadOrder: {
                    who: null,
                    client: orders[i].client._id,
                    agent: orders[i].agent?orders[i].agent._id:undefined,
                    superagent: undefined,
                    organization: orders[i].organization._id,
                    distributer: undefined,
                    invoice: orders[i],
                    manager: undefined,
                    type: 'SET'
                } });
            }
            organizations = await OrganizationZakaji.find({
                $and: [
                    {pass: {$ne: null}},
                    {pass: {$ne: ''}},
                ]
            }).distinct('pass').lean()
            for(let i = 0; i<organizations.length;i++) {
                await reductionOutAdsXMLZakaji(organizations[i])
            }
            let date = new Date()
            if(date.getDay()===1) {
                date.setDate(date.getDate() - 7)
                await SingleOutXMLZakaji.deleteMany({date: {$lte: date}})
                await OutXMLShoroZakaji.deleteMany({date: {$lte: date}})
                await SingleOutXMLReturnedZakaji.deleteMany({date: {$lte: date}})
                await OutXMLReturnedShoroZakaji.deleteMany({date: {$lte: date}})
            }
        } catch (err) {
            let _object = new ModelsErrorZakaji({
                err: err.message,
                path: 'singleOutXMLZakaji thread'
            });
            ModelsErrorZakaji.create(_object)
            console.error(err)
        }
    });
}