const mongoose = require('mongoose');

const ReturnedZakajiSchema = mongoose.Schema({
    items: mongoose.Schema.Types.Mixed,
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClientZakaji'
    },
    allPrice: Number,
    allTonnage: {
        type: Number,
        default: 0
    },
    inv: {
        type: Number,
        default: 0
    },
    allSize: {
        type: Number,
        default: 0
    },
    number: String,
    info: String,
    address: [String],
    confirmationForwarder: {
        type: Boolean,
        default: false
    },
    cancelForwarder: {
        type: Boolean,
        default: false
    },
    sync: {
        type: Number,
        default: 0
    },
    del: String,
    editor: String,
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationZakaji'
    },
    sale: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationZakaji',
        default: null
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationZakaji',
        default: null
    },
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmploymentZakaji'
    },
    district: String,
    guid: String,
    city: String,
    track: {
        type: Number,
        default: 1
    },
    forwarder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmploymentZakaji'
    },
}, {
    timestamps: true
});


const ReturnedZakaji = mongoose.model('ReturnedZakaji', ReturnedZakajiSchema);

module.exports = ReturnedZakaji;