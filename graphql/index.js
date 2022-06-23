const { gql, ApolloServer,  } = require('apollo-server-express');
const { RedisPubSub } = require('graphql-redis-subscriptions');
const pubsub = new RedisPubSub();
module.exports.pubsub = pubsub;
const AdsZakaji = require('./adsZakaji');
const FileZakaji = require('./fileZakaji');
const DiscountClientZakaji = require('./discountClientZakaji');
const IntegrateOutShoroZakaji = require('./integrateOutShoroZakaji');
const DistributerZakaji = require('./distributerZakaji');
const BlogZakaji = require('./blogZakaji');
const SpecialPriceClientZakaji = require('./specialPriceClientZakaji');
const OutXMLAdsZakaji = require('./outXMLAdsZakaji');
const CategoryZakaji = require('./categoryZakaji');
const SubCategoryZakaji = require('./subCategoryZakaji');
const ReturnedZakaji = require('./returnedZakaji');
const OrganizationZakaji = require('./organizationZakaji');
const AgentHistoryGeoZakaji = require('./agentHistoryGeoZakaji');
const ContactZakaji = require('./contactZakaji');
const FaqZakaji = require('./faqZakaji');
const MerchandisingZakaji = require('./merchandisingZakaji');
const ClientZakaji = require('./clientZakaji');
const EmploymentZakaji = require('./employmentZakaji');
const AutoZakaji = require('./autoZakaji');
const ItemZakaji = require('./itemZakaji');
const SubBrand = require('./subBrandZakaji');
const FormZakaji = require('./formZakaji');
const BasketZakaji = require('./basketZakaji');
const OrderZakaji = require('./orderZakaji');
const EquipmentZakaji = require('./equipmentZakaji');
const PassportZakaji = require('./passport');
const RouteZakaji = require('./routeZakaji');
const NotificationStatisticZakaji = require('./notificationStatisticZakaji');
const StatisticZakaji = require('./statistic');
const SubscriberZakaji = require('./subscriberZakaji');
const AgentRouteZakaji = require('./agentRouteZakaji');
const ReceiveDataZakaji = require('./receiveDataZakaji');
const ReviewZakaji = require('./reviewZakaji');
const ConnectionApplicationZakaji = require('./connectionApplicationZakaji');
const LotteryZakaji = require('./lotteryZakaji');
const DistrictZakaji = require('./districtZakaji');
const Integrate1CZakaji = require('./integrate1CZakaji');
const ErrorZakaji = require('./errorZakaji');
const DeliveryDateZakaji = require('./deliveryDateZakaji');
const { verifydeuserGQL } = require('../module/passport');
const { GraphQLScalarType } = require('graphql');
const ModelsErrorZakaji = require('../models/errorZakaji');

const typeDefs = gql`
    scalar Date
    type Data {
       data: String
    }
    type Sort {
        name: String
        field: String
    }
    type Filter {
        name: String
        value: String
    }
    type Social {
        url: String
        image: String
    }
    ${DistrictZakaji.type}
    ${ReviewZakaji.type}
    ${ConnectionApplicationZakaji.type}
    ${LotteryZakaji.type}
    ${DeliveryDateZakaji.type}
    ${ErrorZakaji.type}
    ${AgentRouteZakaji.type}
    ${DistributerZakaji.type}
    ${Integrate1CZakaji.type}
    ${AdsZakaji.type}
    ${FileZakaji.type}
    ${DiscountClientZakaji.type}
    ${ReceiveDataZakaji.type}
    ${IntegrateOutShoroZakaji.type}
    ${SubscriberZakaji.type}
    ${NotificationStatisticZakaji.type}
    ${FaqZakaji.type}
    ${MerchandisingZakaji.type}
    ${AutoZakaji.type}
    ${EquipmentZakaji.type}
    ${ClientZakaji.type}
    ${OrganizationZakaji.type}
    ${AgentHistoryGeoZakaji.type}
    ${BlogZakaji.type}
    ${SpecialPriceClientZakaji.type}
    ${OutXMLAdsZakaji.type}
    ${PassportZakaji.type}
    ${CategoryZakaji.type}
    ${SubCategoryZakaji.type}
    ${ReturnedZakaji.type}
    ${EmploymentZakaji.type}
    ${ItemZakaji.type}
    ${SubBrand.type}
    ${FormZakaji.type}
    ${ContactZakaji.type}
    ${BasketZakaji.type}
    ${OrderZakaji.type}
    ${RouteZakaji.type}
    ${StatisticZakaji.type}
    type Mutation {
        ${Integrate1CZakaji.mutation}
        ${DistrictZakaji.mutation}
        ${ReviewZakaji.mutation}
        ${ConnectionApplicationZakaji.mutation}
        ${LotteryZakaji.mutation}
        ${DeliveryDateZakaji.mutation}
        ${ErrorZakaji.mutation}
        ${AgentRouteZakaji.mutation}
        ${DistributerZakaji.mutation}
        ${AdsZakaji.mutation}
        ${FileZakaji.mutation}
        ${DiscountClientZakaji.mutation}
        ${ReceiveDataZakaji.mutation}
        ${IntegrateOutShoroZakaji.mutation}
        ${SubscriberZakaji.mutation}
        ${NotificationStatisticZakaji.mutation}
        ${FaqZakaji.mutation}
        ${MerchandisingZakaji.mutation}
        ${AutoZakaji.mutation}
        ${EquipmentZakaji.mutation}
        ${ClientZakaji.mutation}
        ${OrganizationZakaji.mutation}
        ${AgentHistoryGeoZakaji.mutation}
        ${CategoryZakaji.mutation}
        ${SubCategoryZakaji.mutation}
        ${ReturnedZakaji.mutation}
        ${BlogZakaji.mutation}
        ${SpecialPriceClientZakaji.mutation}
        ${OutXMLAdsZakaji.mutation}
        ${PassportZakaji.mutation}
        ${EmploymentZakaji.mutation}
        ${ItemZakaji.mutation}
        ${SubBrand.mutation}
        ${FormZakaji.mutation}
        ${ContactZakaji.mutation}
        ${BasketZakaji.mutation}
        ${OrderZakaji.mutation}
        ${RouteZakaji.mutation}
        ${StatisticZakaji.mutation}
    }
    type Query {
        ${Integrate1CZakaji.query}
        ${DistrictZakaji.query}
        ${ReviewZakaji.query}
        ${ConnectionApplicationZakaji.query}
        ${LotteryZakaji.query}
        ${DeliveryDateZakaji.query}
        ${ErrorZakaji.query}
        ${AgentRouteZakaji.query}
        ${DistributerZakaji.query}
        ${ClientZakaji.query}
        ${FaqZakaji.query}
        ${MerchandisingZakaji.query}
        ${AutoZakaji.query}
        ${EquipmentZakaji.query}
        ${OrganizationZakaji.query}
        ${AgentHistoryGeoZakaji.query}
        ${AdsZakaji.query}
        ${FileZakaji.query}
        ${DiscountClientZakaji.query}
        ${ReceiveDataZakaji.query}
        ${IntegrateOutShoroZakaji.query}
        ${SubscriberZakaji.query}
        ${NotificationStatisticZakaji.query}
        ${CategoryZakaji.query}
        ${SubCategoryZakaji.query}
        ${ReturnedZakaji.query}
        ${BlogZakaji.query}
        ${SpecialPriceClientZakaji.query}
        ${OutXMLAdsZakaji.query}
        ${PassportZakaji.query}
        ${EmploymentZakaji.query}
        ${ItemZakaji.query}
        ${SubBrand.query}
        ${FormZakaji.query}
        ${ContactZakaji.query}
        ${BasketZakaji.query}
        ${OrderZakaji.query}
        ${RouteZakaji.query}
        ${StatisticZakaji.query}
    }
    type Subscription {
        ${OrderZakaji.subscription}
        ${ReturnedZakaji.subscription}
    }
`;

const resolvers = {
    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue(value) {
            return new Date(value); // value from the client
        },
        serialize(value) {
            return new Date(value).getTime();
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.INT) {
                return new Date(ast.value)
            }
            return null;
        },
    }),
    Query: {
        ...Integrate1CZakaji.resolvers,
        ...DistrictZakaji.resolvers,
        ...ReviewZakaji.resolvers,
        ...ConnectionApplicationZakaji.resolvers,
        ...LotteryZakaji.resolvers,
        ...DeliveryDateZakaji.resolvers,
        ...ErrorZakaji.resolvers,
        ...AgentRouteZakaji.resolvers,
        ...DistributerZakaji.resolvers,
        ...FaqZakaji.resolvers,
        ...MerchandisingZakaji.resolvers,
        ...AutoZakaji.resolvers,
        ...EquipmentZakaji.resolvers,
        ...ClientZakaji.resolvers,
        ...OrganizationZakaji.resolvers,
        ...AgentHistoryGeoZakaji.resolvers,
        ...BlogZakaji.resolvers,
        ...SpecialPriceClientZakaji.resolvers,
        ...OutXMLAdsZakaji.resolvers,
        ...AdsZakaji.resolvers,
        ...FileZakaji.resolvers,
        ...DiscountClientZakaji.resolvers,
        ...ReceiveDataZakaji.resolvers,
        ...IntegrateOutShoroZakaji.resolvers,
        ...SubscriberZakaji.resolvers,
        ...NotificationStatisticZakaji.resolvers,
        ...PassportZakaji.resolvers,
        ...CategoryZakaji.resolvers,
        ...EmploymentZakaji.resolvers,
        ...SubCategoryZakaji.resolvers,
        ...ReturnedZakaji.resolvers,
        ...ItemZakaji.resolvers,
        ...SubBrand.resolvers,
        ...FormZakaji.resolvers,
        ...ContactZakaji.resolvers,
        ...BasketZakaji.resolvers,
        ...OrderZakaji.resolvers,
        ...RouteZakaji.resolvers,
        ...StatisticZakaji.resolvers,
    },
    Mutation: {
        ...Integrate1CZakaji.resolversMutation,
        ...AgentRouteZakaji.resolversMutation,
        ...ReviewZakaji.resolversMutation,
        ...ConnectionApplicationZakaji.resolversMutation,
        ...LotteryZakaji.resolversMutation,
        ...DistrictZakaji.resolversMutation,
        ...DeliveryDateZakaji.resolversMutation,
        ...ErrorZakaji.resolversMutation,
        ...DistributerZakaji.resolversMutation,
        ...FaqZakaji.resolversMutation,
        ...MerchandisingZakaji.resolversMutation,
        ...ClientZakaji.resolversMutation,
        ...AutoZakaji.resolversMutation,
        ...EquipmentZakaji.resolversMutation,
        ...OrganizationZakaji.resolversMutation,
        ...AgentHistoryGeoZakaji.resolversMutation,
        ...CategoryZakaji.resolversMutation,
        ...SubCategoryZakaji.resolversMutation,
        ...ReturnedZakaji.resolversMutation,
        ...BlogZakaji.resolversMutation,
        ...SpecialPriceClientZakaji.resolversMutation,
        ...OutXMLAdsZakaji.resolversMutation,
        ...AdsZakaji.resolversMutation,
        ...FileZakaji.resolversMutation,
        ...DiscountClientZakaji.resolversMutation,
        ...ReceiveDataZakaji.resolversMutation,
        ...IntegrateOutShoroZakaji.resolversMutation,
        ...SubscriberZakaji.resolversMutation,
        ...NotificationStatisticZakaji.resolversMutation,
        ...EmploymentZakaji.resolversMutation,
        ...PassportZakaji.resolversMutation,
        ...ItemZakaji.resolversMutation,
        ...SubBrand.resolversMutation,
        ...FormZakaji.resolversMutation,
        ...ContactZakaji.resolversMutation,
        ...BasketZakaji.resolversMutation,
        ...OrderZakaji.resolversMutation,
        ...RouteZakaji.resolversMutation,
        ...StatisticZakaji.resolversMutation,
    },
    Subscription: {
        ...OrderZakaji.resolversSubscription,
        ...ReturnedZakaji.resolversSubscription
    }
};

const run = (app)=>{
    const server = new ApolloServer({
        playground: false,
        typeDefs,
        resolvers,
        subscriptions: {
            keepAlive: 1000,
            onConnect: async (connectionParams) => {
                if (connectionParams&&connectionParams.authorization) {
                    let user = await verifydeuserGQL({headers: {authorization: connectionParams.authorization}}, {})
                    return {
                        user: user,
                    }
                }
                else return {
                    user: {}
                }
                //throw new Error('Missing auth token!');
            },
            onDisconnect: (webSocket, context) => {
                // ...
            },
        },
        context: async (ctx) => {
            //console.log(ctx)
            if (ctx.connection) {
                return ctx.connection.context;
            }
            else if(ctx&&ctx.req) {
                ctx.res.header('ACCEPT-CH', 'UA-Full-Version, UA-Mobile, UA-Model, UA-Arch, UA-Platform, ECT, Device-Memory, RTT');
                let user = await verifydeuserGQL(ctx.req, ctx.res)
                return {req: ctx.req, res: ctx.res, user: user};
            }
        },
        formatError: (err) => {
            console.error(err)

            let _object = new ModelsErrorZakaji({
                err: `gql: ${err.message}`,
                path: JSON.stringify(err.path)
            });
            ModelsErrorZakaji.create(_object)

            return err;
        }
    })
    server.applyMiddleware({ app, path : '/graphql', cors: false })
    return server
    //server.listen().then(({ url }) => {console.log(`🚀  Server ready at ${url}`);});
}

module.exports.run = run;
