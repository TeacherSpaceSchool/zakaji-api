const OrganizationZakaji = require('../models/organizationZakaji');
const SingleOutXMLZakaji = require('../models/singleOutXMLZakaji');
const SingleOutXMLReturnedZakaji = require('../models/singleOutXMLReturnedZakaji');
const ClientZakaji = require('../models/clientZakaji');
const SingleOutXMLAdsZakaji = require('../models/singleOutXMLAdsZakaji');
const OutXMLShoroZakaji = require('../models/integrate/shoro/outXMLShoroZakaji');
const OutXMLReturnedShoroZakaji = require('../models/integrate/shoro/outXMLReturnedShoroZakaji');
const OutXMLAdsAShoroZakaji = require('../models/integrate/shoro/outXMLAdsShoroZakaji');

module.exports.reductionSingleOutXMLZakaji = async() => {
    let organization = await OrganizationZakaji
        .findOne({name: 'ЗАО «ШОРО»'})
    organization.pass = 'shoro'
    await organization.save()
    let integrates = await OutXMLShoroZakaji.find({status: {$ne: 'check'}})
    console.log(`reduction SingleOutXMLZakaji: ${integrates.length}`)
    for(let i = 0; i<integrates.length;i++){
        if(!await SingleOutXMLZakaji.findOne({guid: integrates[i].guid})){
            let newIntagrate = new SingleOutXMLZakaji({
                data: integrates[i].data,
                guid: integrates[i].guid,
                date: integrates[i].date,
                number: integrates[i].number,
                agent: integrates[i].agent,
                forwarder: integrates[i].forwarder,
                exc: integrates[i].exc,
                client: integrates[i].client,
                payment: integrates[i].payment,
                inv: integrates[i].inv,
                track: integrates[i].track,
                promo: integrates[i].promo,
                invoice: integrates[i].invoice,
                status: integrates[i].status,
                organization: organization._id,
                pass: organization.pass,

            });
            await SingleOutXMLZakaji.create(newIntagrate);
        }
    }
    integrates = await OutXMLReturnedShoroZakaji.find({status: {$ne: 'check'}})
    console.log(`reduction SingleOutXMLReturnedZakaji: ${integrates.length}`)
    for(let i = 0; i<integrates.length;i++){
        if(!await SingleOutXMLReturnedZakaji.findOne({guid: integrates[i].guid})) {
            let newIntagrate = new SingleOutXMLReturnedZakaji({
                data: integrates[i].data,
                guid: integrates[i].guid,
                date: integrates[i].date,
                number: integrates[i].number,
                client: integrates[i].client,
                agent: integrates[i].agent,
                forwarder: integrates[i].forwarder,
                exc: integrates[i].exc,
                returned: integrates[i].returned,
                track: integrates[i].track,
                status: integrates[i].status,
                organization: organization._id,
                pass: organization.pass,

            });
            await SingleOutXMLReturnedZakaji.create(newIntagrate);
        }
    }
    integrates = await ClientZakaji.find()
    console.log(`reduction ClientZakaji: ${integrates.length}`)
    for(let i = 0; i<integrates.length;i++){
        if(integrates[i].sync.length){
            integrates[i].sync = [organization._id.toString()]
            await integrates[i].save()
        }
    }
    integrates = await OutXMLAdsAShoroZakaji.find()
    console.log(`reduction SingleOutXMLAdsZakaji: ${integrates.length}`)
    for(let i = 0; i<integrates.length;i++){
        if(!await SingleOutXMLAdsZakaji.findOne({guid: integrates[i].guid})) {
            let newIntagrate = new SingleOutXMLAdsZakaji({
                guid: integrates[i].guid,
                district: integrates[i].district,
                organization: organization._id,
                pass: organization.pass,

            });
            await SingleOutXMLAdsZakaji.create(newIntagrate);
        }
    }

}