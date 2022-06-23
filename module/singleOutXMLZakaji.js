const SingleOutXMLZakaji = require('../models/singleOutXMLZakaji');
const SingleOutXMLReturnedZakaji = require('../models/singleOutXMLReturnedZakaji');
const SingleOutXMLAdsZakaji = require('../models/singleOutXMLAdsZakaji');
const ClientZakaji = require('../models/clientZakaji');
const OrganizationZakaji = require('../models/organizationZakaji');
const UserZakaji = require('../models/userZakaji');
const Integrate1CZakaji = require('../models/integrate1CZakaji');
const InvoiceZakaji = require('../models/invoiceZakaji');
const ReturnedZakaji = require('../models/returnedZakaji');
const DistrictZakaji = require('../models/districtZakaji');
const { pdDDMMYYYY, checkInt } = require('./const');
const uuidv1 = require('uuid/v1.js');
const builder = require('xmlbuilder');
const paymentMethod = {'Наличные': 0, 'Перечисление': 1, 'Консигнация': 5}
const { checkFloat } = require('../module/const');

module.exports.setSingleOutXMLReturnedZakaji = async(returned) => {
    let outXMLReturnedZakaji = await SingleOutXMLReturnedZakaji
        .findOne({returned: returned._id})
    if(outXMLReturnedZakaji){
        outXMLReturnedZakaji.status = 'update'
        outXMLReturnedZakaji.data = []
        for (let i = 0; i < returned.items.length; i++) {
            let guidItem = await Integrate1CZakaji
                .findOne({$and: [{item: returned.items[i]._id}, {item: {$ne: null}}]}).select('guid').lean()
            if(guidItem)
                outXMLReturnedZakaji.data.push({
                    guid: guidItem.guid,
                    qt:  returned.items[i].count,
                    price: returned.items[i].price,
                    amount: returned.items[i].allPrice
                })
        }
        await outXMLReturnedZakaji.save()
        await ReturnedZakaji.updateMany({_id: returned._id}, {sync: 1})
    }
    else {
        let guidClient = await Integrate1CZakaji
            .findOne({$and: [{client: returned.client._id}, {client: {$ne: null}}], organization: returned.organization._id}).select('guid').lean()
        if(guidClient){
            let district = await DistrictZakaji
                .findOne({client: returned.client._id, organization: returned.organization._id}).select('agent ecspeditor').lean()
            if(district) {
                let guidAgent = await Integrate1CZakaji
                    .findOne({$and: [{agent: district.agent}, {agent: {$ne: null}}], organization: returned.organization._id}).select('guid').lean()
                let guidEcspeditor = await Integrate1CZakaji
                    .findOne({$and: [{ecspeditor: district.ecspeditor}, {ecspeditor: {$ne: null}}], organization: returned.organization._id}).select('guid').lean()
                if (guidAgent && guidEcspeditor) {
                    let date = new Date(returned.createdAt)
                    if(date.getHours()>=3)
                        date.setDate(date.getDate() + 1)
                    if(date.getDay()===0)
                        date.setDate(date.getDate() + 1)
                    let newOutXMLReturnedZakaji = new SingleOutXMLReturnedZakaji({
                        data: [],
                        guid: returned.guid?returned.guid:await uuidv1(),
                        date: date,
                        number: returned.number,
                        inv: returned.inv,
                        client: guidClient.guid,
                        agent: guidAgent.guid,
                        forwarder: guidEcspeditor.guid,
                        returned: returned._id,
                        status: 'create',
                        organization: returned.organization._id,
                        pass: returned.organization.pass,
                    });
                    for (let i = 0; i < returned.items.length; i++) {
                        let guidItem = await Integrate1CZakaji
                            .findOne({$and: [{item: returned.items[i]._id}, {item: {$ne: null}}]}).select('guid').lean()
                        if (guidItem)
                            newOutXMLReturnedZakaji.data.push({
                                guid: guidItem.guid,
                                qt: returned.items[i].count,
                                price: returned.items[i].price,
                                amount: returned.items[i].allPrice,
                                priotiry: returned.items[i].priotiry
                            })
                    }
                    await SingleOutXMLReturnedZakaji.create(newOutXMLReturnedZakaji);
                    await ReturnedZakaji.updateMany({_id: returned._id}, {sync: 1})
                }
            }
        }
    }
}

module.exports.setSingleOutXMLZakaji = async(invoice) => {
    let count
    let price
    let outXMLZakaji = await SingleOutXMLZakaji
        .findOne({invoice: invoice._id})
    if(outXMLZakaji){
        outXMLZakaji.status = 'update'
        outXMLZakaji.data = []
        for (let i = 0; i < invoice.orders.length; i++) {
            let guidItem = await Integrate1CZakaji
                .findOne({$and: [{item: invoice.orders[i].item._id}, {item: {$ne: null}}]}).select('guid').lean()
            if(guidItem) {
                count = invoice.orders[i].count-invoice.orders[i].returned
                price = checkFloat(invoice.orders[i].allPrice/invoice.orders[i].count)
                outXMLZakaji.data.push({
                    guid: guidItem.guid,
                    package: Math.round(count / (invoice.orders[i].item.packaging ? invoice.orders[i].item.packaging : 1)),
                    qt: count,
                    price: price,
                    amount: checkFloat(count * price),
                    priotiry: invoice.orders[i].item.priotiry
                })
            }
        }
        await outXMLZakaji.save()
        await InvoiceZakaji.updateMany({_id: invoice._id}, {sync: 1})
        return 1
    }
    else {
        let guidClient = await Integrate1CZakaji
            .findOne({$and: [{client: invoice.client._id}, {client: {$ne: null}}], organization: invoice.organization._id}).select('guid').lean()
        if(guidClient){
            let district = await DistrictZakaji
                .findOne({client: invoice.client._id, organization: invoice.organization._id}).select('agent ecspeditor').lean()
            if(district) {
                let guidAgent = await Integrate1CZakaji
                    .findOne({$and: [{agent: district.agent}, {agent: {$ne: null}}], organization: invoice.organization._id}).select('guid').lean()
                let guidEcspeditor = await Integrate1CZakaji
                    .findOne({$and: [{ecspeditor: district.ecspeditor}, {ecspeditor: {$ne: null}}], organization: invoice.organization._id}).select('guid').lean()
                if(guidAgent&&guidEcspeditor){
                    guidAgent = guidAgent.guid
                    guidEcspeditor = guidEcspeditor.guid
                    let date = new Date(invoice.dateDelivery)
                    let newOutXMLZakaji = new SingleOutXMLZakaji({
                        payment: paymentMethod[invoice.paymentMethod],
                        data: [],
                        guid: invoice.guid?invoice.guid:await uuidv1(),
                        date: date,
                        number: invoice.number,
                        client: guidClient.guid,
                        agent: guidAgent,
                        forwarder: guidEcspeditor,
                        invoice: invoice._id,
                        status: 'create',
                        inv: invoice.inv,
                        organization: invoice.organization._id,
                        pass: invoice.organization.pass,
                    });
                    for (let i = 0; i < invoice.orders.length; i++) {
                        let guidItem = await Integrate1CZakaji
                            .findOne({$and: [{item: invoice.orders[i].item._id}, {item: {$ne: null}}]}).select('guid').lean()
                        if (guidItem) {
                            count = invoice.orders[i].count-invoice.orders[i].returned
                            price = checkFloat(invoice.orders[i].allPrice/invoice.orders[i].count)
                            newOutXMLZakaji.data.push({
                                guid: guidItem.guid,
                                package: Math.round(count / (invoice.orders[i].item.packaging ? invoice.orders[i].item.packaging : 1)),
                                qt: count,
                                price: price,
                                amount: checkFloat(count * price),
                                priotiry: invoice.orders[i].item.priotiry
                            })
                        }
                    }
                    await SingleOutXMLZakaji.create(newOutXMLZakaji);
                    await InvoiceZakaji.updateMany({_id: invoice._id}, {sync: 1})
                    return 1
                }
            }
        }
    }
    return 0
}

module.exports.setSingleOutXMLZakajiLogic = async(invoices, forwarder, track) => {
    if(track!=undefined||forwarder) {
        let guidEcspeditor
        if(forwarder){
            guidEcspeditor = await Integrate1CZakaji
                .findOne({$and: [{ecspeditor: forwarder}, {ecspeditor: {$ne: null}}]}).select('guid').lean()
        }
        await SingleOutXMLZakaji.updateMany(
            {invoice: {$in: invoices}},
            {
                status: 'update',
                ...(track!=undefined?{track: track}:{}),
                ...(guidEcspeditor?{forwarder: guidEcspeditor.guid}:{})
            })
        await InvoiceZakaji.updateMany({_id: {$in: invoices}}, {
            sync: 1,
            ...(track!=undefined?{track: track}:{}),
            ...(guidEcspeditor?{forwarder: forwarder}:{})
        })
    }
}

module.exports.setSingleOutXMLReturnedZakajiLogic = async(returneds, forwarder, track) => {
    if(track!=undefined||forwarder) {
        let guidEcspeditor
        if(forwarder){
            guidEcspeditor = await Integrate1CZakaji
                .findOne({$and: [{ecspeditor: forwarder}, {ecspeditor: {$ne: null}}]}).select('guid').lean()
        }
        await SingleOutXMLReturnedZakaji.updateMany(
            {returned: {$in: returneds}},
            {
                status: 'update',
                ...(track!=undefined?{track: track}:{}),
                ...(guidEcspeditor?{forwarder: guidEcspeditor.guid}:{})
            })
        await ReturnedZakaji.updateMany({_id: {$in: returneds}},{
            sync: 1,
            ...(track!=undefined?{track: track}:{}),
            ...(guidEcspeditor?{forwarder: forwarder}:{})
        })
    }
}

module.exports.cancelSingleOutXMLReturnedZakaji = async(returned) => {
    let outXMLReturnedZakaji = await SingleOutXMLReturnedZakaji
        .findOne({returned: returned._id})
    if(outXMLReturnedZakaji){
        outXMLReturnedZakaji.status = 'del'
        await outXMLReturnedZakaji.save()
    }
}

module.exports.cancelSingleOutXMLZakaji = async(invoice) => {
    let outXMLZakaji = await SingleOutXMLZakaji
        .findOne({invoice: invoice._id})
    if(outXMLZakaji){
        outXMLZakaji.status = 'del'
        await outXMLZakaji.save()
        return 1
    }
    return 0
}

module.exports.checkSingleOutXMLZakaji = async(pass, guid, exc) => {
    let outXMLZakaji = await SingleOutXMLZakaji
        .findOne({pass: pass, guid: guid})
    if(outXMLZakaji){
        outXMLZakaji.status =  exc?'error':'check'
        outXMLZakaji.exc =  exc?exc:null
        await outXMLZakaji.save()
        await InvoiceZakaji.updateMany({_id: outXMLZakaji.invoice}, !exc?{sync: 2}:{})
    }
}

module.exports.checkSingleOutXMLReturnedZakaji = async(pass, guid, exc) => {
    let outXMLReturnedZakaji = await SingleOutXMLReturnedZakaji
        .findOne({pass: pass, guid: guid})
    if(outXMLReturnedZakaji){
        outXMLReturnedZakaji.status = exc?'error':'check'
        outXMLReturnedZakaji.exc =  exc?exc:null
        await outXMLReturnedZakaji.save()
        await ReturnedZakaji.updateMany({_id: outXMLReturnedZakaji.returned}, !exc?{sync: 2}:{})
    }
}

module.exports.checkSingleOutXMLClientZakaji = async(pass, guid, exc) => {
    let organization = await OrganizationZakaji
        .findOne({pass: pass}).select('_id').lean()
    let guidClient = await Integrate1CZakaji
        .findOne({guid: guid, organization: organization._id}).select('client').lean()
    if (guidClient&&!exc) {
        let client = await ClientZakaji
            .findOne({_id: guidClient.client})
        client.sync.push(organization._id.toString())
        await client.save()
    }
}

module.exports.getSingleOutXMLZakaji = async(pass) => {
    let result = builder.create('root').att('mode', 'sales');
    let date = new Date()
    if(date.getHours()>=3)
        date.setDate(date.getDate() + 1)
    date.setHours(3, 0, 0, 0)
    let organization = await OrganizationZakaji.findOne({pass}).select('dateDelivery').lean()
    let outXMLs = await SingleOutXMLZakaji
        .find({
            pass: pass,
            ...!organization.dateDelivery?{date: {$lte: date}}:{},
            $and: [
                {status: {$ne: 'check'}},
                {status: {$ne: 'error'}}
            ]
        })
        .populate({path: 'invoice', select: 'info address'})
        .sort('date')
        .lean()
    if(outXMLs.length) {
        for (let i = 0; i < outXMLs.length; i++) {
            let item = result
                .ele('item')
            if (outXMLs[i].status === 'del')
                item.att('del', '1')
            if (outXMLs[i].promo === 1)
                item.att('promo', '1')
            if (outXMLs[i].inv === 1)
                item.att('inv', '1')
            if (outXMLs[i].payment !== undefined)
                item.att('payment', outXMLs[i].payment)
            item.att('guid', outXMLs[i].guid)
            item.att('client', outXMLs[i].client)
            item.att('agent', outXMLs[i].agent)
            item.att('track', outXMLs[i].track ? outXMLs[i].track : 1)
            item.att('forwarder', outXMLs[i].forwarder)
            item.att('date', pdDDMMYYYY(outXMLs[i].date))
            item.att('coment', outXMLs[i].invoice ? `${outXMLs[i].invoice.info} ${outXMLs[i].invoice.address[2] ? `${outXMLs[i].invoice.address[2]}, ` : ''}${outXMLs[i].invoice.address[0]}` : '')

            outXMLs[i].data = outXMLs[i].data.sort(function (a, b) {
                return checkInt(a.priotiry) - checkInt(b.priotiry)
            });

            for (let ii = 0; ii < outXMLs[i].data.length; ii++) {
                item.ele('product')
                    .att('guid', outXMLs[i].data[ii].guid)
                    .att('package', outXMLs[i].data[ii].package)
                    .att('qty', outXMLs[i].data[ii].qt)
                    .att('price', outXMLs[i].data[ii].price)
                    .att('amount', outXMLs[i].data[ii].amount)
            }
        }
        result = result.end({pretty: true})
        return result
    }
    else return ''
}

module.exports.getSingleOutXMLClientZakaji = async(pass) => {
    let result = builder.create('root').att('mode', 'client');
    let organization = await OrganizationZakaji
        .findOne({pass: pass}).select('_id').lean()
    let integrate1Cs =  await Integrate1CZakaji
        .find({
            client: {$ne: null},
            organization: organization._id
        })
        .distinct('client')
        .lean()
    let outXMLs = await DistrictZakaji
        .find({organization: organization._id}).distinct('client').lean()
    outXMLs = await ClientZakaji
        .aggregate([
            { $lookup:
                {
                    from: UserZakaji.collection.collectionName,
                    let: { user: '$user' },
                    pipeline: [
                        { $match: {$expr:{$eq:['$$user', '$_id']}} },
                    ],
                    as: 'user'
                }
            },
            {
                $unwind:{
                    preserveNullAndEmptyArrays : true,
                    path : '$user'
                }
            },
            {
                $match:{
                    $and: [
                        {_id: {$in: outXMLs}},
                        {_id: {$in: integrate1Cs}}
                    ],
                    sync: {$ne: organization._id.toString()},
                    'user.status': 'active',
                    del: {$ne: 'deleted'}
                }
            },
            { $limit : 100 },
        ])
    if(outXMLs.length) {
        for(let i=0;i<outXMLs.length;i++){
            let guidClient = await Integrate1CZakaji
                .findOne({$and: [{client: outXMLs[i]._id}, {client: {$ne: null}}], organization: organization._id}).select('guid').lean()
            if(guidClient){
                let district = await DistrictZakaji
                    .findOne({client: outXMLs[i]._id, organization: organization._id}).select('agent').lean()
                let agent;
                if(district&&district.agent){
                    agent= await Integrate1CZakaji
                        .findOne({$and: [{agent: district.agent}, {agent: {$ne: null}}], organization: organization._id}).select('guid').lean()
                }
                let item = result
                    .ele('item')
                item.att('guid', guidClient.guid)
                item.att('name', outXMLs[i].address[0][2]?outXMLs[i].address[0][2]:'')
                item.att('contact', outXMLs[i].name?outXMLs[i].name:'')
                item.att('address', outXMLs[i].address[0][0]?outXMLs[i].address[0][0]:'')
                item.att('tel', outXMLs[i].phone?outXMLs[i].phone:'')
                if(agent)
                    item.att('agent', agent.guid)
            }
        }
        result = result.end({ pretty: true})
        return result
    }
    else return ''
}

module.exports.getSingleOutXMLReturnedZakaji = async(pass) => {
    let result = builder.create('root').att('mode', 'returned');
    let outXMLReturneds = await SingleOutXMLReturnedZakaji
        .find({pass: pass, $and: [{status: {$ne: 'check'}}, {status: {$ne: 'error'}}]})
        .populate({path: 'returned'})
        .sort('date')
        .lean()
    if(outXMLReturneds.length) {
        for(let i=0;i<outXMLReturneds.length;i++){
        let item = result
            .ele('item')
        if(outXMLReturneds[i].status==='del')
            item.att('del', '1')
        if (outXMLReturneds[i].inv === 1)
            item.att('inv', '1')
        item.att('guid', outXMLReturneds[i].guid)
        item.att('client', outXMLReturneds[i].client)
        item.att('agent', outXMLReturneds[i].agent)
        item.att('forwarder', outXMLReturneds[i].forwarder)
        item.att('date', pdDDMMYYYY(outXMLReturneds[i].date))
        item.att('track', outXMLReturneds[i].track?outXMLReturneds[i].track:1)
        item.att('coment', `${outXMLReturneds[i].returned.info} ${outXMLReturneds[i].returned.address[2]?`${outXMLReturneds[i].returned.address[2]}, `:''}${outXMLReturneds[i].returned.address[0]}`)

        outXMLReturneds[i].data = outXMLReturneds[i].data.sort(function (a, b) {
            return checkInt(a.priotiry) - checkInt(b.priotiry)
        });

        for(let ii=0;ii<outXMLReturneds[i].data.length;ii++){
            item.ele('product')
                .att('guid', outXMLReturneds[i].data[ii].guid)
                .att('qty',  outXMLReturneds[i].data[ii].qt)
                .att('price', outXMLReturneds[i].data[ii].price)
                .att('amount', outXMLReturneds[i].data[ii].amount)
        }
    }
        result = result.end({ pretty: true})
        return result
    }
    else return ''
}

module.exports.reductionOutAdsXMLZakaji = async(pass) => {
    let dateXml = new Date()
    dateXml.setHours(3, 0, 0, 0)
    let guidItems = {}
    let organization = await OrganizationZakaji
        .findOne({pass: pass}).select('_id pass').lean()
    let districts = await DistrictZakaji.find({
        organization: organization._id
    }).select('_id agent ecspeditor client name').lean()
    for(let i=0;i<districts.length;i++) {
        let outXMLAdsZakaji = await SingleOutXMLAdsZakaji.findOne({district: districts[i]._id}).select('guid').lean()
        if(outXMLAdsZakaji) {
            let guidAgent = await Integrate1CZakaji
                .findOne({$and: [{agent: {$ne: null}}, {agent: districts[i].agent}], organization: organization._id}).select('guid').lean()
            let guidEcspeditor = await Integrate1CZakaji
                .findOne({$and: [{ecspeditor: {$ne: null}}, {ecspeditor: districts[i].ecspeditor}], organization: organization._id}).select('guid').lean()
            if (guidAgent && guidEcspeditor) {
                let orders = await InvoiceZakaji.find(
                    {
                        dateDelivery: dateXml,
                        del: {$ne: 'deleted'},
                        taken: true,
                        organization: organization._id,
                        adss: {$ne: []},
                        client: {$in: districts[i].client}
                    }
                )
                    .select('adss')
                    .populate({
                        path: 'adss'
                    })
                    .lean()
                if (orders.length>0) {
                    let newOutXMLZakaji = new SingleOutXMLZakaji({
                        data: [],
                        guid: await uuidv1(),
                        date: dateXml,
                        number: `акции ${districts[i].name}`,
                        client: outXMLAdsZakaji.guid,
                        agent: guidAgent.guid,
                        forwarder: guidEcspeditor.guid,
                        invoice: null,
                        status: 'create',
                        promo: 1,
                        organization: organization._id,
                        pass: organization.pass
                    });
                    let itemsData = {}
                    for (let i1 = 0; i1 < orders.length; i1++) {
                        for (let i2 = 0; i2 < orders[i1].adss.length; i2++) {
                            if (orders[i1].adss[i2].item) {
                                if (!guidItems[orders[i1].adss[i2].item])
                                    guidItems[orders[i1].adss[i2].item] = await Integrate1CZakaji.findOne({
                                        $and: [{item: orders[i1].adss[i2].item}, {item: {$ne: null}}]
                                    }).populate('item')
                                if (guidItems[orders[i1].adss[i2].item]) {
                                    if (!itemsData[guidItems[orders[i1].adss[i2].item].guid])
                                        itemsData[guidItems[orders[i1].adss[i2].item].guid] = {
                                            guid: guidItems[orders[i1].adss[i2].item].guid,
                                            qt: 0,
                                            price: guidItems[orders[i1].adss[i2].item].item.price,
                                            amount: 0,
                                            package: (guidItems[orders[i1].adss[i2].item].item.packaging ? guidItems[orders[i1].adss[i2].item].item.packaging : 1),
                                            priotiry: guidItems[orders[i1].adss[i2].item].item.priotiry
                                        }
                                    itemsData[guidItems[orders[i1].adss[i2].item].guid].qt += orders[i1].adss[i2].count
                                }
                            }
                        }
                    }
                    itemsData = Object.values(itemsData)
                    itemsData = itemsData.map(itemData => {
                        return {
                            guid: itemData.guid,
                            package: Math.round(itemData.qt / itemData.package),
                            qt: itemData.qt,
                            price: itemData.price,
                            priotiry: itemData.priotiry,
                            amount: checkFloat(itemData.qt * itemData.price)
                        }
                    })
                    newOutXMLZakaji.data = itemsData
                    await SingleOutXMLZakaji.create(newOutXMLZakaji);
                }
            }
        }
    }
}