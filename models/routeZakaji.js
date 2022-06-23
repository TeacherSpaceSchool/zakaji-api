const mongoose = require('mongoose');

const RouteZakajiSchema = mongoose.Schema({
    deliverys: [{
        legs:[[String]],
        orders: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'InvoiceZakaji'
        }],
        tonnage: {
            type: Number,
            default: 0
        },
        lengthInMeters: {
            type: Number,
            default: 0
        }
    }],
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationZakaji'
    },
    selectProdusers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationZakaji'
    }],
    selectDistricts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DistrictZakaji'
    }],
    selectEcspeditor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmploymentZakaji'
    },
    selectAuto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AutoZakaji'
    },
    selectedOrders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InvoiceZakaji'
    }],
    dateDelivery: Date,
    status: String,
    number: String,
    allTonnage: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});


const RouteZakaji = mongoose.model('RouteZakaji', RouteZakajiSchema);

module.exports = RouteZakaji;