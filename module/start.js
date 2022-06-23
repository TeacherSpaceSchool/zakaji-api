const { reductionCategoryZakaji } = require('../module/categoryZakaji');
const { reductionSubCategoryZakaji } = require('../module/subCategoryZakaji');
const { reductionSubBrands } = require('../module/subBrandZakaji');
const { reductionToRoute } = require('../module/routeZakaji');
const { reductionToAgentRoute } = require('../module/agentRouteZakaji');
const { reductionSingleOutXMLZakaji } = require('../module/reductionSingleOutXMLZakaji');
const { reductionReviews } = require('../module/reviewZakaji');
const { reductionOutAdsXMLZakaji } = require('../module/singleOutXMLZakaji');
const { reductionToOrganization } = require('../module/organizationZakaji');
const { reductionToEmployment } = require('../module/employmentZakaji');
const { reductionToClient } = require('../module/clientZakaji');
const { reductionToAds } = require('../module/adsZakaji');
const { reductionToItem } = require('../module/itemZakaji');
const { reductionInvoices } = require('../module/invoiceZakaji');
const { reductionReturneds } = require('../module/returnedZakaji');
const { reductionToDeliveryDate } = require('../module/deliveryDateZakaji');
const { reductionMerchandising } = require('../module/merchandisingZakaji');
const { reductionRepairEquipment } = require('../module/repairEquipmentZakaji');
const { startClientRedis } = require('../module/redis');
const { reductionToUser, createAdmin } = require('../module/user');
const { Worker, isMainThread } = require('worker_threads');
const OrganizationZakaji = require('../models/organizationZakaji');
const InvoiceZakaji = require('../models/invoiceZakaji');
const OrderZakaji = require('../models/orderZakaji');
const { setSingleOutXMLZakaji } = require('../module/singleOutXMLZakaji');
const { checkAdss } = require('../graphql/adsZakaji');
const { pubsub } = require('../graphql/index');
const MerchandisingZakaji = require('../models/merchandisingZakaji');

let startDeleteBD = async () => {
    if(isMainThread) {
        let w = new Worker('./thread/deleteBD.js', {workerData: 0});
        w.on('message', (msg) => {
            console.log('DeleteBD: '+msg);
        })
        w.on('error', console.error);
        w.on('exit', (code) => {
            if(code !== 0)
                console.error(new Error(`DeleteBD stopped with exit code ${code}`))
        });
        console.log('DeleteBD '+w.threadId+ ' run')
    }
}

let startResetUnloading = async () => {
    if(isMainThread) {
        let w = new Worker('./thread/resetUnloading.js', {workerData: 0});
        w.on('message', (msg) => {
            console.log('ResetUnloading: '+msg);
        })
        w.on('error', console.error);
        w.on('exit', (code) => {
            if(code !== 0)
                console.error(new Error(`ResetUnloading stopped with exit code ${code}`))
        });
        console.log('ResetUnloading '+w.threadId+ ' run')
    }
}

let startOutXMLShoroZakaji = async () => {
    if(isMainThread) {
        let w = new Worker('./thread/singleOutXMLZakaji.js', {workerData: 0});
        w.on('message', (msg) => {
            console.log('SingleOutXMLZakaji: '+msg);
        })
        w.on('error', console.error);
        w.on('exit', (code) => {
            if(code !== 0)
                console.error(new Error(`SingleOutXMLZakaji stopped with exit code ${code}`))
        });
        console.log('SingleOutXMLZakaji '+w.threadId+ ' run')
    }
}

let startReminderClient = async () => {
    if(isMainThread) {
        let w = new Worker('./thread/reminderClient.js', {workerData: 0});
        w.on('message', (msg) => {
            console.log('ReminderClient: '+msg);
        })
        w.on('error', console.error);
        w.on('exit', (code) => {
            if(code !== 0)
                console.error(new Error(`ReminderClient stopped with exit code ${code}`))
        });
        console.log('ReminderClient '+w.threadId+ ' run')
    }
}

let start = async () => {
    await createAdmin();
    //await startClientRedis()
    await reductionMerchandising()
    await reductionRepairEquipment()
    await startResetUnloading()
    await startReminderClient();
    await startOutXMLShoroZakaji();
    await startDeleteBD();
    await reductionReviews();
    //await reductionToEmployment()
    //await reductionSubBrands();
    //await reductionToDeliveryDate();
    //await reductionSingleOutXMLZakaji()
    //await reductionInvoices()
    //await reductionReturneds()
    //await reductionCategoryZakaji()
    //await reductionSubCategoryZakaji()
    //await reductionToRoute()
    //await reductionToClient()
    //await reductionToOrganization()
    //await reductionToItem()
    //await reductionToUser()
    await reductionToAgentRoute();
    //await reductionOutAdsXMLShoroZakaji()
    //await reductionToAds()
}

module.exports.start = start;
