const AgentHistoryGeoZakaji = require('../models/agentHistoryGeoZakaji');
const InvoiceZakaji = require('../models/invoiceZakaji');
const EmploymentZakaji = require('../models/employmentZakaji');
const UserZakaji = require('../models/userZakaji');
const {getGeoDistance, pdDDMMYYHHMM} = require('../module/const');

const type = `
  type AgentHistoryGeo {
    _id: ID
    createdAt: Date
    geo: String
    client: Client
    agent: Employment
  }
`;

const query = `
    agentHistoryGeos(organization: ID, agent: ID, date: String): Statistic
    agentMapGeos(agent: ID!, date: String): [[String]]
`;

const mutation = `
    addAgentHistoryGeo(client: ID!, geo: String!): Data
`;

const resolvers = {
    agentHistoryGeos: async(parent, {organization, agent, date}, {user}) => {
        if(['суперорганизация', 'организация', 'менеджер', 'admin' ].includes(user.role)) {
            let dateStart = date?new Date(date):new Date()
            dateStart.setHours(3, 0, 0, 0)
            let dateEnd = new Date(dateStart)
            dateEnd.setDate(dateEnd.getDate() + 1)
            let data = []
            let agents = []
            if (!agent) {
                if (organization !== 'super')
                    agents = await EmploymentZakaji.find({organization: organization}).distinct('_id').lean()
                else {
                    agents = await UserZakaji.find({role: 'суперагент'}).distinct('_id').lean()
                    agents = await EmploymentZakaji.find({user: {$in: agents}}).distinct('_id').lean()
                }
            }

            let agentHistoryGeoZakajis = await AgentHistoryGeoZakaji.find({
                $and: [{createdAt: {$gte: dateStart}}, {createdAt: {$lt: dateEnd}}],
                ...(agent ? {agent: agent} : {agent: {$in: agents}})
            })
                .select('agent client _id createdAt geo')
                .populate({
                    path: 'client',
                    select: '_id name address'
                })
                .populate({
                    path: 'agent',
                    select: '_id name'
                })
                .sort('-createdAt')
                .lean()
            if (!agent) {
                let dataKey = {}
                for (let i = 0; i < agentHistoryGeoZakajis.length; i++) {
                    if (!dataKey[agentHistoryGeoZakajis[i].agent._id])
                        dataKey[agentHistoryGeoZakajis[i].agent._id] = {
                            _id: agentHistoryGeoZakajis[i].agent._id,
                            count: 0,
                            name: agentHistoryGeoZakajis[i].agent.name,
                            cancel: 0,
                            order: 0
                        }
                    dataKey[agentHistoryGeoZakajis[i].agent._id].count += 1
                    if (await InvoiceZakaji.findOne({
                            $and: [{createdAt: {$gte: dateStart}}, {createdAt: {$lt: dateEnd}}],
                            client: agentHistoryGeoZakajis[i].client._id,
                            del: {$ne: 'deleted'},
                            taken: true
                        }).select('_id').lean())
                        dataKey[agentHistoryGeoZakajis[i].agent._id].order += 1
                    else
                        dataKey[agentHistoryGeoZakajis[i].agent._id].cancel += 1
                }
                const keys = Object.keys(dataKey)
                for (let i = 0; i < keys.length; i++) {
                    data.push({
                        _id: dataKey[keys[i]]._id,
                        data: [
                            dataKey[keys[i]].name,
                            dataKey[keys[i]].count,
                            dataKey[keys[i]].order,
                            dataKey[keys[i]].cancel,
                        ]
                    })
                }
                return {
                    columns: ['агент', 'посещений', 'заказов', 'отказов'],
                    row: data
                };
            }
            else {
                for (let i = 0; i < agentHistoryGeoZakajis.length; i++) {
                    data.push({
                        _id: agentHistoryGeoZakajis[i]._id,
                        data: [
                            pdDDMMYYHHMM(agentHistoryGeoZakajis[i].createdAt),
                            `${agentHistoryGeoZakajis[i].client.name}${agentHistoryGeoZakajis[i].client.address && agentHistoryGeoZakajis[i].client.address[0] ? ` (${agentHistoryGeoZakajis[i].client.address[0][2] ? `${agentHistoryGeoZakajis[i].client.address[0][2]}, ` : ''}${agentHistoryGeoZakajis[i].client.address[0][0]})` : ''}`,
                            agentHistoryGeoZakajis[i].client.address[0][1] ? `${getGeoDistance(...(agentHistoryGeoZakajis[i].geo.split(', ')), ...(agentHistoryGeoZakajis[i].client.address[0][1].split(', ')))} м` : '-',
                            agentHistoryGeoZakajis[i].agent.name,
                            await InvoiceZakaji.findOne({
                                $and: [{createdAt: {$gte: dateStart}}, {createdAt: {$lt: dateEnd}}],
                                client: agentHistoryGeoZakajis[i].client._id,
                                del: {$ne: 'deleted'},
                                taken: true
                            })
                                .select('_id')
                                .sort('-createdAt')
                                .lean() ? 'заказ' : 'отказ'
                        ]
                    })
                }
                return {
                    columns: ['дата', 'клиент', 'растояние', 'агент', 'статус'],
                    row: data
                };
            }
        }
    },
    agentMapGeos: async(parent, {agent, date}, {user}) => {
        if(['суперорганизация', 'организация', 'менеджер', 'admin' ].includes(user.role)) {
            let dateStart = date?new Date(date):new Date()
            dateStart.setHours(3, 0, 0, 0)
            let dateEnd = new Date(dateStart)
            dateEnd.setDate(dateEnd.getDate() + 1)
            let data = []
            let take
            let agentHistoryGeoZakajis = await AgentHistoryGeoZakaji.find({
                $and: [{createdAt: {$gte: dateStart}}, {createdAt: {$lt: dateEnd}}],
                agent: agent
            })
                .select('agent client _id createdAt geo')
                .populate({
                    path: 'client',
                    select: '_id name address'
                })
                .populate({
                    path: 'agent',
                    select: '_id name'
                })
                .sort('-createdAt')
                .lean()
            for (let i = 0; i < agentHistoryGeoZakajis.length; i++) {
                take = await InvoiceZakaji.findOne({
                    $and: [{createdAt: {$gte: dateStart}}, {createdAt: {$lt: dateEnd}}],
                    client: agentHistoryGeoZakajis[i].client._id,
                    del: {$ne: 'deleted'},
                    taken: true
                })
                    .select('_id')
                    .sort('-createdAt')
                    .lean()
                if(take&&agentHistoryGeoZakajis[i].client.address[0][1]){
                    data.push([
                        `агент ${agentHistoryGeoZakajis[i].client.name}${agentHistoryGeoZakajis[i].client.address&&agentHistoryGeoZakajis[i].client.address[0]?` (${agentHistoryGeoZakajis[i].client.address[0][2] ? `${agentHistoryGeoZakajis[i].client.address[0][2]}, ` : ''}${agentHistoryGeoZakajis[i].client.address[0][0]})` : ''}`,
                        agentHistoryGeoZakajis[i].geo,
                        '#FFFF00'
                    ])
                    data.push([
                        `${agentHistoryGeoZakajis[i].client.name}${agentHistoryGeoZakajis[i].client.address&&agentHistoryGeoZakajis[i].client.address[0]?` (${agentHistoryGeoZakajis[i].client.address[0][2] ? `${agentHistoryGeoZakajis[i].client.address[0][2]}, ` : ''}${agentHistoryGeoZakajis[i].client.address[0][0]})` : ''}`,
                        agentHistoryGeoZakajis[i].client.address[0][1],
                        '#4b0082'
                    ])
                }
                }
                return data
        }
    },
};

const resolversMutation = {
    addAgentHistoryGeo: async(parent, {client, geo}, {user}) => {
        if(['агент', 'суперагент'].includes(user.role)){
            let dateStart = new Date()
            dateStart.setHours(3, 0, 0, 0)
            let dateEnd = new Date(dateStart)
            dateEnd.setDate(dateEnd.getDate() + 1)
            let _object = await AgentHistoryGeoZakaji.findOne({
                $and: [{createdAt: {$gte: dateStart}}, {createdAt: {$lt:dateEnd}}],
                client: client,
                agent: user.employment
            })
                .select('_id')
                .lean()
            if(!_object) {
                _object = new AgentHistoryGeoZakaji({
                    agent: user.employment,
                    client: client,
                    geo: geo
                })
                await AgentHistoryGeoZakaji.create(_object)
            }
        }
        return {data: 'OK'};
    },
};

module.exports.resolversMutation = resolversMutation;
module.exports.mutation = mutation;
module.exports.type = type;
module.exports.query = query;
module.exports.resolvers = resolvers;