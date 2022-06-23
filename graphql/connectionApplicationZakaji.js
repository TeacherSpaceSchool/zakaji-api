const ConnectionApplicationZakaji = require('../models/connectionApplicationZakaji');

const type = `
  type ConnectionApplication {
    _id: ID
    createdAt: Date
    name: String
    phone: String
    address: String
    whereKnow: String
    taken: Boolean
  }
`;

const query = `
    connectionApplications(skip: Int, filter: String): [ConnectionApplication]
    filterConnectionApplication: [Filter]
    connectionApplicationsSimpleStatistic(filter: String): Int
`;

const mutation = `
    addConnectionApplication(name: String!, phone: String!, address: String!, whereKnow: String!): Data
    acceptConnectionApplication(_id: ID!): Data
    deleteConnectionApplication(_id: [ID]!): Data
`;

const resolvers = {
    connectionApplications: async(parent, {skip, filter}, {user}) => {
        if('admin'===user.role) {
            return await ConnectionApplicationZakaji.aggregate(
                [
                    {
                        $match: {
                            ...(filter === 'обработка' ? {taken: false} : {})
                        }
                    },
                    {$sort: {'createdAt': -1}},
                    {$skip: skip != undefined ? skip : 0},
                    {$limit: skip != undefined ? 15 : 10000000000}
                ])
        }
    },
    connectionApplicationsSimpleStatistic: async(parent, {filter}, {user}) => {
        if('admin'===user.role)
            return await ConnectionApplicationZakaji.countDocuments({
                ...(filter === 'обработка' ? {taken: false} : {})
            }).lean()
    },
    filterConnectionApplication: async(parent, ctx, {user}) => {
        if('admin'===user.role) {
            let filter = [
                {
                    name: 'Все',
                    value: ''
                },
                {
                    name: 'Обработка',
                    value: 'обработка'
                }
            ]
            return filter
        }
    },
};

const resolversMutation = {
    addConnectionApplication: async(parent, {name, phone, address, whereKnow}, {user}) => {
        if(!user.role){
            let _object = new ConnectionApplicationZakaji({
                name,
                phone,
                address,
                whereKnow,
                taken: false
            });
            await ConnectionApplicationZakaji.create(_object)
            return {data: 'OK'}
        }
    },
    acceptConnectionApplication: async(parent, {_id}, {user}) => {
        if('admin'===user.role) {
            let object = await ConnectionApplicationZakaji.findById(_id)
            object.taken = true
            await object.save();
        }
        return {data: 'OK'}
    },
    deleteConnectionApplication: async(parent, { _id }, {user}) => {
        if(user.role==='admin'){
            await ConnectionApplicationZakaji.deleteMany({_id: {$in: _id}})
        }
        return {data: 'OK'}
    }
};

module.exports.resolversMutation = resolversMutation;
module.exports.mutation = mutation;
module.exports.type = type;
module.exports.query = query;
module.exports.resolvers = resolvers;