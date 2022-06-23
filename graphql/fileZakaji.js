const app = require('../app');
const {pdDDMMYYHHMM} = require('../module/const');
const fs = require('fs');
const path = require('path');
const dirs = ['images', 'xlsx']
const { deleteFile, urlMain, checkFloat } = require('../module/const');
const ClientZakaji = require('../models/clientZakaji');
const BlogZakaji = require('../models/blogZakaji');
const ContactZakaji = require('../models/contactZakaji');
const CategoryZakaji = require('../models/categoryZakaji');
const AdsZakaji = require('../models/adsZakaji');
const OrganizationZakaji = require('../models/organizationZakaji');
const ItemZakaji = require('../models/itemZakaji');
const FaqZakaji = require('../models/faqZakaji');

const type = `
  type File {
    name: String
    url: String
    size: Float
    createdAt: String
    active: String
    owner: String
  }
`;

const query = `
    files(filter: String!): [File]
    filterFile: [Filter]
`;

const mutation = `
    clearAllDeactiveFiles: Data
`;

const resolvers = {
    files: async(parent, {filter}, {user}) => {
        if(user.role==='admin') {
            let data = [], res = [], filesUrl = [], stat, size, createdAt, url
            for (let i = 0; i < dirs.length; i++) {
                url = path.join(app.dirname, 'public', dirs[i])
                const files = fs.readdirSync(url, 'utf8');
                for (let name of files) {
                    url = path.join(app.dirname, 'public', dirs[i], name)
                    stat = fs.statSync(url)
                    createdAt = pdDDMMYYHHMM(stat.atime)
                    size = Math.round((stat.size/1000000) * 1000)/1000;
                    data.push({name, size, url: dirs[i], createdAt});
                    filesUrl.push(`${urlMain}/${dirs[i]}/${name}`)
                }
            }
            res = [
                ...(await ClientZakaji.find({image: {$in: filesUrl}}).select('name image').lean()).map(element=>{return {...element, type: 'Клиент'}}),
                ...(await BlogZakaji.find({image: {$in: filesUrl}}).select('title image').lean()).map(element=>{return {...element, name: element.title, type: 'Блог'}}),
                ...(await ContactZakaji.find({image: {$in: filesUrl}}).select('image').lean()).map(element=>{return {...element, name: 'Zakaji.Store', type: 'Контакты'}}),
                ...(await CategoryZakaji.find({image: {$in: filesUrl}}).select('name image').lean()).map(element=>{return {...element, type: 'Категория'}}),
                ...(await AdsZakaji.find({image: {$in: filesUrl}}).select('title image').lean()).map(element=>{return {...element, name: element.title, type: 'Акция'}}),
                ...(await OrganizationZakaji.find({image: {$in: filesUrl}}).select('name image').lean()).map(element=>{return {...element, type: 'Организация'}}),
                ...(await ItemZakaji.find({image: {$in: filesUrl}}).select('name image').lean()).map(element=>{return {...element, type: 'Товар'}}),
                ...(await FaqZakaji.find({url: {$in: filesUrl}}).select('title url').lean()).map(element=>{return {...element, name: element.title, type: 'Инструкция'}}),
            ]
            filesUrl = {}
            for (let i = 0; i < res.length; i++) {
                filesUrl[res[i].image?res[i].image:res[i].url?res[i].url:'lol'] = res[i]
            }
            res = []
            let fileUrl
            for (let i = 0; i < data.length; i++) {
                fileUrl = filesUrl[`${urlMain}/${data[i].url}/${data[i].name}`]
                data[i].active = fileUrl ? 'активен' : 'неактивен'
                data[i].owner = fileUrl? `${fileUrl.type} ${fileUrl.name}`: 'Отсутствует'
                if(!filter.length||(filter==='active'&&fileUrl)||(filter==='deactive'&&!fileUrl))
                    res.push(data[i])
            }
            res = res.sort(function (a, b) {
                return b.size - a.size
            });
            return res;
        }
    },
    filterFile: async(parent, ctx, {user}) => {
        let filter = [
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
        if(user.role)
            filter.push()
        return filter
    },
};

const resolversMutation = {
    clearAllDeactiveFiles: async(parent, ctx, {user}) => {
        if('admin'===user.role){
            let data = [], url, filesUrl = []
            for (let i = 0; i < dirs.length; i++) {
                url = path.join(app.dirname, 'public', dirs[i])
                const files = fs.readdirSync(url, 'utf8');
                for (let name of files) {
                    data.push(`${urlMain}/${dirs[i]}/${name}`)
                }
            }
            filesUrl = [
                ...(await ClientZakaji.find({image: {$in: data}}).distinct('image').lean()),
                ...(await BlogZakaji.find({image: {$in: data}}).distinct('image').lean()),
                ...(await ContactZakaji.find({image: {$in: data}}).distinct('image').lean()),
                ...(await CategoryZakaji.find({image: {$in: data}}).distinct('image').lean()),
                ...(await AdsZakaji.find({image: {$in: data}}).distinct('image').lean()),
                ...(await OrganizationZakaji.find({image: {$in: data}}).distinct('image').lean()),
                ...(await ItemZakaji.find({image: {$in: data}}).distinct('image').lean()),
                ...(await FaqZakaji.find({url: {$in: data}}).distinct('url').lean()),
            ]
            for (let i = 0; i < data.length; i++) {
                if(!filesUrl.includes(data[i]))
                    await deleteFile(data[i])
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