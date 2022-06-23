const ReceivedDataZakaji = require('../models/receivedDataZakaji');
const DistrictZakaji = require('../models/districtZakaji');
const Integrate1CZakaji = require('../models/integrate1CZakaji');
const ClientZakaji = require('../models/clientZakaji');
const AgentRouteZakaji = require('../models/agentRouteZakaji');
const UserZakaji = require('../models/userZakaji');
const OrganizationZakaji = require('../models/organizationZakaji');
const randomstring = require('randomstring');

const type = `
  type ReceivedData {
    _id: ID
    createdAt: Date
    organization: Organization
    guid: String
    name: String
    addres: String
    agent: String
    phone: String
    type: String
    status: String
    position: String
  }
`;

const query = `
    receivedDatas(search: String!, filter: String!, organization: ID!): [ReceivedData]
    filterReceivedData: [Filter]
`;

const mutation = `
    clearAllReceivedDatas(organization: ID!): Data
    deleteReceivedData(_ids: [ID]!): Data
    addReceivedDataClient(_id: ID!): Data
`;

const resolvers = {
    receivedDatas: async(parent, {search, filter, organization}, {user}) => {
        if(['суперорганизация', 'организация', 'менеджер', 'admin'].includes(user.role)) {
            return await ReceivedDataZakaji.find({
                organization: user.organization?user.organization:organization,
                type: {'$regex': filter, '$options': 'i'},
                ...search.length ? {
                    $or: [
                        {name: {'$regex': search, '$options': 'i'}},
                        {addres: {'$regex': search, '$options': 'i'}}
                    ]
                } : {},
            })
                .sort('-createdAt')
                .lean()
        }
    },
    filterReceivedData: async(parent, ctx, {user}) => {
        let filter = [
            {
                name: 'Все',
                value: ''
            },
            {
                name: 'Сотрудники',
                value: 'сотрудник'
            },
            {
                name: 'Клиенты',
                value: 'клиент'
            }
        ]
        return filter
    },
};

const resolversMutation = {
    clearAllReceivedDatas: async(parent, {organization}, {user}) => {
        if('admin'===user.role){
            await ReceivedDataZakaji.deleteMany({organization: organization})
        }
        return {data: 'OK'}
    },
    deleteReceivedData: async(parent, { _ids }, {user}) => {
        if(['суперорганизация', 'организация', 'менеджер', 'admin'].includes(user.role)) {
            await ReceivedDataZakaji.deleteMany({_id: {$in: _ids}})
        }
        return {data: 'OK'}
    },
    addReceivedDataClient: async(parent, { _id }, {user}) => {
        if(['суперорганизация', 'организация', 'менеджер', 'admin'].includes(user.role)) {
            let receivedData = await ReceivedDataZakaji.findOne({_id: _id}).lean()
            let integrate1CZakaji = await Integrate1CZakaji.findOne({
                organization: receivedData.organization,
                guid: receivedData.guid
            }).select('_id client').lean()
            if(!integrate1CZakaji){
                let district = await DistrictZakaji.findOne({
                    agent: receivedData.agent
                })
                if(district) {
                    let organization = await OrganizationZakaji.findOne({_id: receivedData.organization}).select('_id cities').lean()
                    let _client = new UserZakaji({
                        login: randomstring.generate(20),
                        role: 'client',
                        status: 'deactive',
                        password: '12345678',
                    });
                    _client = await UserZakaji.create(_client);
                    _client = new ClientZakaji({
                        name: 'Новый',
                        phone: receivedData.phone,
                        city: organization.cities[0],
                        address: [[receivedData.addres ? receivedData.addres : '', '', receivedData.name ? receivedData.name : '']],
                        user: _client._id,
                        notification: false
                    });
                    _client = await ClientZakaji.create(_client);
                    let _object = new Integrate1CZakaji({
                        item: null,
                        client: _client._id,
                        agent: null,
                        ecspeditor: null,
                        organization: receivedData.organization,
                        guid: receivedData.guid,
                    });
                    await Integrate1CZakaji.create(_object)
                    district.client.push(_client._id)
                    await district.save()
                    await ReceivedDataZakaji.deleteMany({_id: _id})
                }
                else return
            }
            else {
                let _client = await ClientZakaji.findOne({_id: integrate1CZakaji.client});
                _client.phone = receivedData.phone
                _client.address = [[receivedData.addres?receivedData.addres:'', '', receivedData.name?receivedData.name:'']]
                await _client.save()

                let newDistrict = await DistrictZakaji.findOne({
                    agent: receivedData.agent
                })
                if(newDistrict&&!newDistrict.client.toString().includes(_client._id.toString())){
                    let oldDistrict = await DistrictZakaji.findOne({
                        client: _client._id
                    })
                    if(oldDistrict){
                        let objectAgentRouteZakaji = await AgentRouteZakaji.findOne({district: oldDistrict._id})
                        if(objectAgentRouteZakaji){
                            for(let i=0; i<7; i++) {
                                let index = objectAgentRouteZakaji.clients[i].indexOf(_client._id.toString())
                                if(index!==-1)
                                    objectAgentRouteZakaji.clients[i].splice(index, 1)
                            }
                            await objectAgentRouteZakaji.save()
                        }
                        for(let i=0; i<oldDistrict.client.length; i++) {
                            if(oldDistrict.client[i].toString()===_client._id.toString()){
                                oldDistrict.client.splice(i, 1)
                                break
                            }
                        }
                    }

                    newDistrict.client.push(_client._id)
                    await newDistrict.save()
                }

                await ReceivedDataZakaji.deleteMany({_id: _id})
            }
        }
        return {data: 'OK'}
    }
};

module.exports.resolversMutation = resolversMutation;
module.exports.mutation = mutation;
module.exports.type = type;
module.exports.query = query;
module.exports.resolvers = resolvers;