const mongoose = require('mongoose');

const InvoiceZakajiSchema = mongoose.Schema({
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderZakaji'
    }],
    adss: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AdsZakaji'
        }],
    priority: {
        type: Number,
        default: 0
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClientZakaji'
    },
    allPrice: Number,
    consignmentPrice: {
        type: Number,
        default: 0
    },
    returnedPrice: {
        type: Number,
        default: 0
    },
    allTonnage: {
        type: Number,
        default: 0
    },
    allSize: {
        type: Number,
        default: 0
    },
    inv: {
        type: Number,
        default: 0
    },
    city: {
        type: String,
        default: 'Бишкек'
    },
    number: String,
    guid: String,
    info: String,
    address: [String],
    paymentMethod: String,
    dateDelivery: Date,
    confirmationForwarder: Boolean,
    confirmationClient: Boolean,
    paymentConsignation: Boolean,
    cancelClient: {
        type: Date,
        default: null
    },
    cancelForwarder: {
        type: Date,
        default: null
    },
    sync: {
        type: Number,
        default: 0
    },
    track: {
        type: Number,
        default: 1
    },
    forwarder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmploymentZakaji'
    },
    taken: {
        type: Boolean,
        default: false
    },
    distributed: {
        type: Boolean,
        default: false
    },
    del: String,
    district: String,
    discount: Number,
    editor: String,
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmploymentZakaji'
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationZakaji'
    },
    distributer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationZakaji',
        default: null
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationZakaji',
        default: null
    },
    sale: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationZakaji',
        default: null
    },
    who: mongoose.Schema.Types.ObjectId
}, {
    timestamps: true
});

InvoiceZakajiSchema.index({createdAt: 1})
InvoiceZakajiSchema.index({adss: 1})
InvoiceZakajiSchema.index({client: 1})
InvoiceZakajiSchema.index({taken: 1})
InvoiceZakajiSchema.index({cancelClient: 1})
InvoiceZakajiSchema.index({cancelForwarder: 1})
InvoiceZakajiSchema.index({number: 1})
InvoiceZakajiSchema.index({info: 1})
InvoiceZakajiSchema.index({address: 1})
InvoiceZakajiSchema.index({paymentMethod: 1})
InvoiceZakajiSchema.index({dateDelivery: 1})
InvoiceZakajiSchema.index({del: 1})
InvoiceZakajiSchema.index({agent: 1})
InvoiceZakajiSchema.index({organization: 1})
InvoiceZakajiSchema.index({distributer: 1})
InvoiceZakajiSchema.index({provider: 1})
InvoiceZakajiSchema.index({sale: 1});

const InvoiceZakaji = mongoose.model('InvoiceZakaji', InvoiceZakajiSchema);

module.exports = InvoiceZakaji;