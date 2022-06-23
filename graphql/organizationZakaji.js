const mongoose = require('mongoose');
const OrganizationZakaji = require('../models/organizationZakaji');
const AutoZakaji = require('../models/autoZakaji');
const RepairEquipmentZakaji = require('../models/repairEquipmentZakaji');
const EmploymentZakaji = require('../models/employmentZakaji');
const SubBrandZakaji = require('../models/subBrandZakaji');
const DeliveryDateZakaji = require('../models/deliveryDateZakaji');
const DistributerZakaji = require('../models/distributerZakaji');
const DistrictZakaji = require('../models/districtZakaji');
const Integrate1CZakaji = require('../models/integrate1CZakaji');
const AgentRouteZakaji = require('../models/agentRouteZakaji');
const ItemZakaji = require('../models/itemZakaji');
const BasketZakaji = require('../models/basketZakaji');
const UserZakaji = require('../models/userZakaji');
const AdsZakaji = require('../models/adsZakaji');
const PlanZakaji = require('../models/planZakaji');
const { saveImage, saveFile, deleteFile, urlMain } = require('../module/const');

const type = `
  type Organization {
    _id: ID
    createdAt: Date
    name: String
    address: [String]
    email: [String]
    phone: [String]
    info: String
    miniInfo: String
    catalog: String
    reiting: Int
    status: String
    type: String
    image: String
    warehouse: String
    minimumOrder: Int
    accessToClient: Boolean
    unite: Boolean
    addedClient: Boolean
    superagent: Boolean
    consignation: Boolean
    onlyDistrict: Boolean
    dateDelivery: Boolean
    onlyIntegrate: Boolean
    autoAccept: Boolean
    cities: [String]
    del: String
    priotiry: Int
    pass: String
  }
`;

const query = `
    brandOrganizations(search: String!, filter: String!, city: String): [Organization]
    organizations(search: String!, filter: String!, city: String): [Organization]
    organizationsTrash(search: String!): [Organization]
    organization(_id: ID!): Organization
    filterOrganization: [Filter]
`;

const mutation = `
    addOrganization(cities: [String]!, catalog: Upload, pass: String, warehouse: String!, miniInfo: String!, priotiry: Int, minimumOrder: Int, image: Upload!, name: String!, address: [String]!, email: [String]!, phone: [String]!, info: String!, accessToClient: Boolean!, consignation: Boolean!, addedClient: Boolean!, unite: Boolean!, superagent: Boolean!, onlyDistrict: Boolean!, dateDelivery: Boolean!, onlyIntegrate: Boolean!, autoAccept: Boolean!): Data
    setOrganization(cities: [String], pass: String, catalog: Upload, warehouse: String, miniInfo: String, _id: ID!, priotiry: Int, minimumOrder: Int, image: Upload, name: String, address: [String], email: [String], phone: [String], info: String, accessToClient: Boolean, consignation: Boolean, addedClient: Boolean, unite: Boolean, superagent: Boolean, onlyDistrict: Boolean, dateDelivery: Boolean, onlyIntegrate: Boolean, autoAccept: Boolean): Data
    restoreOrganization(_id: [ID]!): Data
    deleteOrganization(_id: [ID]!): Data
    onoffOrganization(_id: [ID]!): Data
`;

const resolvers = {
    brandOrganizations: async(parent, {search, filter, city}, {user}) => {
        if(['admin', 'экспедитор', 'суперорганизация', 'организация', 'менеджер', 'агент', 'суперагент', 'суперэкспедитор', 'client'].includes(user.role)){
            let organizationsRes = [], subBrands = [], onlyIntegrate, onlyDistrict, organizationId
            let brandOrganizations = await ItemZakaji.find({
                ...user.role==='admin'?{}:{status: 'active'},
                del: {$ne: 'deleted'}
            }).select('organization subBrand').lean()
            subBrands = brandOrganizations.map(elem=>elem.subBrand)
            brandOrganizations = brandOrganizations.map(elem=>{
                if(user.role!=='client'||!elem.subBrand) return elem.organization
            })
            if(user.organization){
                brandOrganizations = await DistributerZakaji.findOne({
                    distributer: user.organization
                }).distinct('sales').lean()
                brandOrganizations = [...brandOrganizations, user.organization]
            }
            const organizations = await OrganizationZakaji.find({
                _id: {$in: brandOrganizations},
                name: {'$regex': search, '$options': 'i'},
                status: 'admin'===user.role?filter.length===0?{'$regex': filter, '$options': 'i'}:filter:'active',
                ...city?{cities: city}:{},
                del: {$ne: 'deleted'},
                ...['суперагент', 'суперэкспедитор'].includes(user.role)?{superagent: true}:{},
                ...user.city?{cities: user.city}:{}
            })
                .select('name _id image miniInfo onlyIntegrate onlyDistrict priotiry catalog')
                .sort('-priotiry')
                .lean()
            if(!user.organization) {
                subBrands = await SubBrandZakaji.find({
                    _id: {$in: subBrands},
                    name: {'$regex': search, '$options': 'i'},
                    status: 'admin'===user.role?filter.length===0?{'$regex': filter, '$options': 'i'}:filter:'active',
                    ...city?{cities: city}:{},
                    del: {$ne: 'deleted'},
                    ...user.city?{cities: user.city}:{}
                })
                    .populate({
                        path: 'organization',
                        select: 'onlyIntegrate onlyDistrict _id unite'
                    })
                    .sort('-priotiry')
                    .lean()
                for(let i = 0; i<subBrands.length;i++){
                    subBrands[i].type = 'subBrand'
                    subBrands[i].unite = subBrands[i].organization.unite
                }
                organizationsRes = [...subBrands, ...organizations]
                organizationsRes = organizationsRes.sort(function (a, b) {
                    return b.priotiry - a.priotiry
                });
                if(user.role==='client') {
                    for (let i = 0; i < organizationsRes.length; i++) {
                        onlyIntegrate =  organizationsRes[i].organization?organizationsRes[i].organization.onlyIntegrate:organizationsRes[i].onlyIntegrate
                        onlyDistrict = organizationsRes[i].organization?organizationsRes[i].organization.onlyDistrict:organizationsRes[i].onlyDistrict
                        organizationId = organizationsRes[i].organization?organizationsRes[i].organization._id:organizationsRes[i]._id
                        if (onlyIntegrate && onlyDistrict) {
                            let district = await DistrictZakaji.findOne({
                                client: user.client,
                                organization: organizationId
                            }).select('_id').lean()
                            let integrate = await Integrate1CZakaji.findOne({
                                client: user.client,
                                organization: organizationId
                            }).select('_id').lean()
                            if(!integrate||!district) {
                                organizationsRes.splice(i, 1)
                                i -= 1
                            }
                        }
                        else if (onlyDistrict) {
                            let district = await DistrictZakaji.findOne({
                                client: user.client,
                                organization: organizationId
                            }).select('_id').lean()
                            if (!district) {
                                organizationsRes.splice(i, 1)
                                i -= 1
                            }
                        }
                        else if (onlyIntegrate) {
                            let integrate = await Integrate1CZakaji.findOne({
                                client: user.client,
                                organization: organizationId
                            }).select('_id').lean()
                            if (!integrate) {
                                organizationsRes.splice(i, 1)
                                i -= 1
                            }
                        }
                    }
                }
                return organizationsRes
            }
            else return organizations
        }
    },
    organizations: async(parent, {search, filter, city}, {user}) => {
        return await OrganizationZakaji.find({
            name: {'$regex': search, '$options': 'i'},
            ...user.role!=='admin'?{status:'active'}:filter.length?{status: filter}:{},
            ...city?{cities: city}:{},
            del: {$ne: 'deleted'}
        })
            .select('name _id image miniInfo')
            .sort('-priotiry')
            .lean()
    },
    organizationsTrash: async(parent, {search}, {user}) => {
        if(user.role==='admin'){
            return await OrganizationZakaji.find({
                name: {'$regex': search, '$options': 'i'},
                del: 'deleted'
            })
                .select('name _id image miniInfo')
                .sort('-createdAt')
                .lean()
        }
    },
    organization: async(parent, {_id}) => {
        if(mongoose.Types.ObjectId.isValid(_id)) {
            let subBrand = await SubBrandZakaji.findOne({_id: _id}).select('organization name').lean()
            let organization = await OrganizationZakaji.findOne({
                _id: subBrand?subBrand.organization:_id
            })
                .lean()
            if(subBrand) organization.name = `${subBrand.name} (${organization.name})`
            return organization
        }
    },
    filterOrganization: async(parent, ctx, {user}) => {
        if(user.role==='admin')
            return await [
                {
                    name: 'Все',
                    value: ''
                },
                {
                    name: 'Активные',
                    value: 'active'
                },
                {
                    name: 'Неактивные',
                    value: 'deactive'
                }
            ]
        else
            return await []
    },
};

const resolversMutation = {
    addOrganization: async(parent, {cities, catalog, addedClient, autoAccept, dateDelivery, pass, warehouse, superagent, unite, miniInfo, priotiry, info, phone, email, address, image, name, minimumOrder, accessToClient, consignation, onlyDistrict, onlyIntegrate}, {user}) => {
        if(user.role==='admin'){
            let { stream, filename } = await image;
            filename = await saveImage(stream, filename)
            let objectOrganization = new OrganizationZakaji({
                image: urlMain+filename,
                name: name,
                status: 'active',
                address: address,
                email: email,
                phone: phone,
                info: info,
                minimumOrder: minimumOrder,
                reiting: 0,
                accessToClient: accessToClient,
                consignation: consignation,
                priotiry: priotiry,
                onlyDistrict: onlyDistrict,
                unite: unite,
                superagent: superagent,
                onlyIntegrate: onlyIntegrate,
                miniInfo: miniInfo,
                warehouse: warehouse,
                cities: cities,
                autoAccept: autoAccept,
                dateDelivery,
                addedClient: addedClient
            });
            if(catalog){
                let { stream, filename } = await catalog;
                objectOrganization.catalog = urlMain+(await saveFile(stream, filename))
            }
            if(pass)
                objectOrganization.pass = pass
            objectOrganization = await OrganizationZakaji.create(objectOrganization)
        }
        return {data: 'OK'};
    },
    setOrganization: async(parent, {catalog, cities, addedClient, dateDelivery, autoAccept, pass, warehouse, miniInfo, superagent, unite, _id, priotiry, info, phone, email, address, image, name, minimumOrder, accessToClient, consignation, onlyDistrict, onlyIntegrate}, {user}) => {
        if(user.role==='admin'||(['суперорганизация', 'организация'].includes(user.role)&&user.organization.toString()===_id.toString())) {
            let object = await OrganizationZakaji.findById(_id)
            if (image) {
                let {stream, filename} = await image;
                await deleteFile(object.image)
                filename = await saveImage(stream, filename)
                object.image = urlMain + filename
            }
            if(catalog){
                if(object.catalog)
                    await deleteFile(object.catalog)
                let { stream, filename } = await catalog;
                object.catalog = urlMain+(await saveFile(stream, filename))
            }
            if(pass!==undefined) object.pass = pass
            if(cities) object.cities = cities
            if(name) object.name = name
            if(info) object.info = info
            if(phone) object.phone = phone
            if(email) object.email = email
            if(address) object.address = address
            if(warehouse) object.warehouse = warehouse
            if(superagent!=undefined) object.superagent = superagent
            if(unite!=undefined) object.unite = unite
            if(onlyDistrict!=undefined) object.onlyDistrict = onlyDistrict
            if(autoAccept!=undefined) object.autoAccept = autoAccept
            if(dateDelivery!=undefined) object.dateDelivery = dateDelivery
            if(onlyIntegrate!=undefined) object.onlyIntegrate = onlyIntegrate
            if(priotiry!=undefined) object.priotiry = priotiry
            if(consignation!=undefined) object.consignation = consignation
            if(accessToClient!=undefined) object.accessToClient = accessToClient
            if(minimumOrder!=undefined) object.minimumOrder = minimumOrder
            if(miniInfo!=undefined) object.miniInfo = miniInfo
            if(addedClient!=undefined) object.addedClient = addedClient
            await object.save();
        }
        return {data: 'OK'}
    },
    restoreOrganization: async(parent, { _id }, {user}) => {
        if(user.role==='admin'){
            await OrganizationZakaji.updateMany({_id: {$in: _id}}, {del: null, status: 'active'})
        }
        return {data: 'OK'}
    },
    deleteOrganization: async(parent, { _id }, {user}) => {
        if(user.role==='admin'){
            for(let i=0; i<_id.length; i++) {
                let items = await ItemZakaji.find({organization: _id[i]}).distinct('_id').lean()
                await BasketZakaji.deleteMany({item: {$in: items}})
                await ItemZakaji.updateMany({organization: _id[i]}, {del: 'deleted', status: 'deactive'})
                let users = await EmploymentZakaji.find({organization: _id[i]}).distinct('user').lean()
                await UserZakaji.updateMany({_id: {$in: users}}, {status: 'deactive'})
                await EmploymentZakaji.updateMany({organization: _id[i]}, {del: 'deleted'})
                await SubBrandZakaji.deleteMany({organization: _id[i]})
                await Integrate1CZakaji.deleteMany({organization: _id[i]})
                await AgentRouteZakaji.deleteMany({organization: _id[i]})
                await DistrictZakaji.deleteMany({organization: _id[i]})
                await DistributerZakaji.deleteMany({distributer: _id[i]})
                let distributers = await DistributerZakaji.find({
                    $or: [
                        {sales: _id[i]},
                        {provider: _id[i]}
                    ]
                })
                for(let i=0; i<distributers.length; i++){
                        distributers[i].sales.splice(_id[i], 1)
                        distributers[i].provider.splice(_id[i], 1)
                    await distributers[i].save()
                }
                await AutoZakaji.deleteMany({organization: _id[i]})
                await RepairEquipmentZakaji.deleteMany({organization: _id[i]})
                await OrganizationZakaji.updateMany({_id: _id[i]}, {del: 'deleted', status: 'deactive'})
                await AdsZakaji.updateMany({organization: _id[i]}, {del: 'deleted'})
                await PlanZakaji.deleteMany({organization: _id[i]})
                await DeliveryDateZakaji.deleteMany({organization: _id[i]})
            }
        }
        return {data: 'OK'}
    },
    onoffOrganization: async(parent, { _id }, {user}) => {
        if(user.role==='admin'){
            let objects = await OrganizationZakaji.find({_id: {$in: _id}})
            for(let i=0; i<objects.length; i++){
                objects[i].status = objects[i].status==='active'?'deactive':'active'
                await SubBrandZakaji.updateMany({organization: objects[i]._id}, {status: objects[i].status})
                await EmploymentZakaji.updateMany({organization: objects[i]._id}, {status: objects[i].status})
                let items = await ItemZakaji.find({organization: objects[i]._id}).distinct('_id').lean()
                await BasketZakaji.deleteMany({item: {$in: items}})
                await ItemZakaji.updateMany({organization: objects[i]._id}, {status: objects[i].status})
                await objects[i].save()
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