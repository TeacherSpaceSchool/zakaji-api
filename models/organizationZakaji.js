const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const OrganizationZakajiSchema = mongoose.Schema({
    name:  {
        type: String,
        required: true,
        unique: true
    },
    image: String,
    address: [String],
    email: [String],
    phone: [String],
    info: String,
    miniInfo: String,
    reiting: Number,
    status: String,
    catalog: String,
    warehouse:  {
        type: String,
        default: ''
    },
    minimumOrder: Number,
    priotiry: {
        type: Number,
        default: 0
    },
    del: String,
    consignation: {
        type: Boolean,
        default: false
    },
    accessToClient: {
        type: Boolean,
        default: false
    },
    onlyDistrict: {
        type: Boolean,
        default: false
    },
    dateDelivery: {
        type: Boolean,
        default: false
    },
    addedClient: {
        type: Boolean,
        default: false
    },
    unite: {
        type: Boolean,
        default: true
    },
    superagent: {
        type: Boolean,
        default: true
    },
    onlyIntegrate: {
        type: Boolean,
        default: false
    },
    autoAccept: {
        type: Boolean,
        default: false
    },
    pass: {
        type: String,
        default: ''
    },
    cities:  [String],
}, {
    timestamps: true
});

OrganizationZakajiSchema.plugin(uniqueValidator);

const OrganizationZakaji = mongoose.model('OrganizationZakaji', OrganizationZakajiSchema);


module.exports = OrganizationZakaji;