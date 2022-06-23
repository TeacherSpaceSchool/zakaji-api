const OutXMLShoroZakaji = require('../models/singleOutXMLZakaji');
const OutXMLReturnedShoroZakaji = require('../models/singleOutXMLReturnedZakaji');
const Integrate1CZakaji = require('../models/integrate1CZakaji');
const DistrictZakaji = require('../models/districtZakaji');
const InvoiceZakaji = require('../models/invoiceZakaji');
const ReturnedZakaji = require('../models/returnedZakaji');

const type = `
  type OutXMLShoro{
    _id: ID
    createdAt: Date
    guid: String
    date: Date
    number: String
    client: String
    agent: String
    forwarder: String
    invoice: Invoice
    status: String
    organization: String
    exc: String
  }
  type OutXMLReturnedShoro{
    _id: ID
    createdAt: Date
    guid: String
    date: Date
    number: String
    client: String
    agent: String
     organization: String
   forwarder: String
    returned: Returned
    status: String
    exc: String
  }
`;

const query = `
    outXMLShoros(search: String!, filter: String!, skip: Int, organization: ID!): [OutXMLShoro]
    statisticOutXMLShoros(organization: ID!): [String]
    outXMLReturnedShoros(search: String!, filter: String!, skip: Int, organization: ID!): [OutXMLReturnedShoro]
    statisticOutXMLReturnedShoros(organization: ID!): [String]
    filterOutXMLShoro: [Filter]
`;

const mutation = `
    setDateOutXMLShoro(_id: ID!, date: String!): Data
    restoreOutXMLShoro(_id: ID!): OutXMLShoro
    deleteOutXMLShoro(_id: ID!): Data
    deleteOutXMLShoroAll(organization: ID!): Data
    setDateOutXMLReturnedShoro(_id: ID!, date: String!): Data
    restoreOutXMLReturnedShoro(_id: ID!): OutXMLReturnedShoro
    deleteOutXMLReturnedShoro(_id: ID!): Data
    deleteOutXMLReturnedShoroAll(organization: ID!): Data
`;

const resolvers = {
    outXMLShoros: async(parent, {search, filter, skip, organization}, {user}) => {
        if('admin'===user.role){
            let outXMLShoro = await OutXMLShoroZakaji
                .find({
                    status: {'$regex': filter, '$options': 'i'},
                    number: {'$regex': search, '$options': 'i'},
                    organization: organization
                })
                .sort('-createdAt')
                .skip(skip!=undefined?skip:0)
                .limit(skip!=undefined?15:10000000000)
                .lean()
            return outXMLShoro
        }
        else return []
    },
    statisticOutXMLShoros: async(parent, {organization}, {user}) => {
        if('admin'===user.role){
            let outXMLShoro = await OutXMLShoroZakaji
                .find({organization: organization}).lean()
            let procces = 0;
            let error = 0;
            let check = 0;
            for(let i=0; i<outXMLShoro.length; i++){
                if(outXMLShoro[i].status==='check')
                    check+=1
                else if(['update', 'create', 'del'].includes(outXMLShoro[i].status))
                    procces+=1
                else if(outXMLShoro[i].status==='error')
                    error+=1
            }

            return [check, procces, error]
        }
        else return []
    },
    statisticOutXMLReturnedShoros: async(parent, {organization}, {user}) => {
        if('admin'===user.role){
            let outXMLReturnedShoroZakaji = await OutXMLReturnedShoroZakaji
                .find({organization: organization})
                .select('status')
                .lean()
            let procces = 0;
            let error = 0;
            let check = 0;
            for(let i=0; i<outXMLReturnedShoroZakaji.length; i++){
                if(outXMLReturnedShoroZakaji[i].status==='check')
                    check+=1
                else if(['update', 'create', 'del'].includes(outXMLReturnedShoroZakaji[i].status))
                    procces+=1
                else if(outXMLReturnedShoroZakaji[i].status==='error')
                    error+=1
            }

            return [procces, check, error]
        }
        else return []
    },
    outXMLReturnedShoros: async(parent, {search, filter, skip, organization}, {user}) => {
        if('admin'===user.role){
            let outXMLShoro = await OutXMLReturnedShoroZakaji
                .find({
                    status: {'$regex': filter, '$options': 'i'},
                    number: {'$regex': search, '$options': 'i'},
                    organization: organization
                })
                .sort('-createdAt')
                .skip(skip!=undefined?skip:0)
                .limit(skip!=undefined?100:10000000000)
            return outXMLShoro
        }
        else return []
    },
    filterOutXMLShoro: async(parent, ctx, {user}) => {
        if('admin'===user.role)
            return [
                {
                    name: 'Все',
                    value: ''
                },
                {
                    name: 'Создан',
                    value: 'create'
                },
                {
                    name: 'Обновлен',
                    value: 'update'
                },
                {
                    name: 'На удаление',
                    value: 'del'
                },
                {
                    name: 'Выполнен',
                    value: 'check'
                },
                {
                    name: 'Ошибка',
                    value: 'error'
                }
            ]
        else return []
    }
};

const resolversMutation = {
    setDateOutXMLShoro: async(parent, {_id, date}, {user}) => {
        if('admin'===user.role){
            let object = await OutXMLShoroZakaji.findById(_id)
            object.date = new Date(date)
            object.status = 'update'
            await object.save();
        }
        return {data: 'OK'}
    },
    restoreOutXMLShoro: async(parent, { _id }, {user}) => {
        if('admin'===user.role){
            let object = await OutXMLShoroZakaji.findById(_id)
            let invoice = await InvoiceZakaji.findOne({_id: object.invoice})
            let guidClient = await Integrate1CZakaji
                .findOne({client: invoice.client, organization: invoice.organization})
            if(guidClient) {
                let district = await DistrictZakaji
                    .findOne({client: invoice.client, organization: invoice.organization})
                if(district) {
                    let guidAgent = await Integrate1CZakaji
                        .findOne({agent: district.agent})
                    let guidEcspeditor = await Integrate1CZakaji
                        .findOne({ecspeditor: district.ecspeditor})
                    if (guidAgent && guidEcspeditor) {
                        invoice.sync = 1
                        await invoice.save()
                        object.client = guidClient.guid
                        object.agent = guidAgent.guid
                        object.forwarder = guidEcspeditor.guid
                        object.status = 'update'
                    }
                }
            }
            await object.save();
            return object
        }
    },
    deleteOutXMLShoro: async(parent, { _id }, {user}) => {
        if('admin'===user.role){
            let object = await OutXMLShoroZakaji.findOne({_id: _id, status: {$ne: 'check'}})
            await InvoiceZakaji.updateMany({_id: object._id}, {sync: 0});
            await OutXMLShoroZakaji.deleteMany({_id: _id})
        }
        return {data: 'OK'}
    },
    deleteOutXMLShoroAll: async(parent, {organization}, {user}) => {
        if('admin'===user.role){
            let objects = await OutXMLShoroZakaji.find({organization: organization, status: {$ne: 'check'}}).distinct('_id')
            await InvoiceZakaji.updateMany({_id: {$in: objects}}, {sync: 0});
            await OutXMLShoroZakaji.deleteMany({status: {$ne: 'check'}})
        }
        return {data: 'OK'}
    },
    setDateOutXMLReturnedShoro: async(parent, {_id, date}, {user}) => {
        if('admin'===user.role){
            let object = await OutXMLReturnedShoroZakaji.findById(_id)
            object.date = new Date(date)
            object.status = 'update'
            await object.save();
        }
        return {data: 'OK'}
    },
    restoreOutXMLReturnedShoro: async(parent, { _id }, {user}) => {
        if('admin'===user.role){
            let object = await OutXMLReturnedShoroZakaji.findById(_id)
            let returned = await ReturnedZakaji.findOne({_id: object.returned})
            let guidClient = await Integrate1CZakaji
                .findOne({client: returned.client, organization: returned.organization})
            if(guidClient) {
                let district = await DistrictZakaji
                    .findOne({client: returned.client, organization: returned.organization})
                if(district) {
                    let guidAgent = await Integrate1CZakaji
                        .findOne({agent: district.agent})
                    let guidEcspeditor = await Integrate1CZakaji
                        .findOne({ecspeditor: district.ecspeditor})
                    if (guidAgent && guidEcspeditor) {
                        returned.sync = 1
                        await returned.save()
                        object.client = guidClient.guid
                        object.agent = guidAgent.guid
                        object.forwarder = guidEcspeditor.guid
                        object.status = 'update'
                    }
                }
            }
            await object.save();
            return object
        }
    },
    deleteOutXMLReturnedShoro: async(parent, { _id }, {user}) => {
        if('admin'===user.role){
            let object = await OutXMLReturnedShoroZakaji.findOne({_id: _id, status: {$ne: 'check'}})
            await ReturnedZakaji.updateMany({_id: object._id}, {sync: 0});
            await OutXMLReturnedShoroZakaji.deleteMany({_id: _id})
        }
        return {data: 'OK'}
    },
    deleteOutXMLReturnedShoroAll: async(parent, {organization}, {user}) => {
        if('admin'===user.role){
            let objects = await OutXMLReturnedShoroZakaji.find({organization: organization, status: {$ne: 'check'}}).distinct('_id')
            await ReturnedZakaji.updateMany({_id: {$in: objects}}, {sync: 0});
            await OutXMLReturnedShoroZakaji.deleteMany({status: {$ne: 'check'}})
        }
        return {data: 'OK'}
    },
};

module.exports.resolversMutation = resolversMutation;
module.exports.mutation = mutation;
module.exports.type = type;
module.exports.query = query;
module.exports.resolvers = resolvers;