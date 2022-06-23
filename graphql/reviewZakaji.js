const ReviewZakaji = require('../models/reviewZakaji');
const ClientZakaji = require('../models/clientZakaji');
const OrganizationZakaji = require('../models/organizationZakaji');
const SubBrandZakaji = require('../models/subBrandZakaji');
const mongoose = require('mongoose');

const type = `
  type Review {
    _id: ID
    createdAt: Date
    organization: Organization
    client: Client
    taken: Boolean
    type: String
    text: String
  }
`;

const query = `
    reviews(organization: ID, skip: Int, filter: String): [Review]
    filterReview: [Filter]
`;

const mutation = `
    addReview(organization: ID!, text: String!, type: String!): Review
    acceptReview(_id: ID!): Data
    deleteReview(_id: [ID]!): Data
`;

const resolvers = {
    reviews: async(parent, {organization, skip, filter}, {user}) => {
        if(['суперорганизация', 'организация', 'admin', 'client'].includes(user.role)) {
            let invoices = await ReviewZakaji.aggregate(
                [
                    {
                        $match: {
                            ...user.organization ? {organization: user.organization} : organization ? {organization: new mongoose.Types.ObjectId(organization)} : {},
                            ...user.client ? {client: user.client} : {}
                        }
                    },
                    {
                        $match: {
                            ...(filter === 'обработка' ? {taken: false} : {})
                        }
                    },
                    { $sort : {'createdAt': -1} },
                    {$skip: skip != undefined ? skip : 0},
                    {$limit: skip != undefined ? 15 : 10000000000},
                    {
                        $lookup:
                            {
                                from: ClientZakaji.collection.collectionName,
                                let: {client: '$client'},
                                pipeline: [
                                    {$match: {$expr: {$eq: ['$$client', '$_id']}}},
                                ],
                                as: 'client'
                            }
                    },
                    {
                        $unwind: {
                            preserveNullAndEmptyArrays: false,
                            path: '$client'
                        }
                    },
                    {
                        $lookup:
                            {
                                from: OrganizationZakaji.collection.collectionName,
                                let: {organization: '$organization'},
                                pipeline: [
                                    {$match: {$expr: {$eq: ['$$organization', '$_id']}}},
                                ],
                                as: 'organization'
                            }
                    },
                    {
                        $unwind: {
                            preserveNullAndEmptyArrays: true,
                            path: '$organization'
                        }
                    }
                ])
            for(let i=0; i<invoices.length; i++) {
                if(!invoices[i].organization) {
                    invoices[i].organization = (await ReviewZakaji.findOne({_id: invoices[i]._id}).select('organization').lean()).organization
                    invoices[i].organization = await SubBrandZakaji.findOne({_id: invoices[i].organization}).select('_id name').lean()
                }
            }
            return invoices
        }
    },
    filterReview: async(parent, ctx, {user}) => {
        if(['суперорганизация', 'организация', 'admin', 'client'].includes(user.role)) {
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
    addReview: async(parent, {organization, text, type}, {user}) => {
        if(user.role==='client'){
            let _object = new ReviewZakaji({
                organization: organization,
                client: user.client,
                taken: false,
                type: type,
                text: text
            });
            await ReviewZakaji.create(_object)
            return await ReviewZakaji.findById({_id: _object._id}).lean()
        }
    },
    acceptReview: async(parent, {_id}, {user}) => {
        if(['суперорганизация', 'организация', 'admin'].includes(user.role)) {
            let object = await ReviewZakaji.findById(_id)
            object.taken = true
            await object.save();
        }
        return {data: 'OK'}
    },
    deleteReview: async(parent, { _id }, {user}) => {
        if(user.role==='admin'){
            await ReviewZakaji.deleteMany({_id: {$in: _id}})
        }
        return {data: 'OK'}
    }
};

module.exports.resolversMutation = resolversMutation;
module.exports.mutation = mutation;
module.exports.type = type;
module.exports.query = query;
module.exports.resolvers = resolvers;