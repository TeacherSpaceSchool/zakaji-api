const mongoose = require('mongoose');

const OrderZakajiSchema = mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ItemZakaji'
    },
    count: Number,
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClientZakaji'
    },
    consignment: {
        type: Number,
        default: 0
    },
    returned: {
        type: Number,
        default: 0
    },
    consignmentPrice: {
        type: Number,
        default: 0
    },
    costPrice: {
        type: Number,
        default: 0
    },
    allPrice: Number,
    allTonnage: {
        type: Number,
        default: 0
    },
    allSize: {
        type: Number,
        default: 0
    },
    status: String,
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmploymentZakaji'
    },
    setRoute: {
        type: Boolean,
        default: false
    },
    ads: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdsZakaji'
    },
}, {
    timestamps: true
});


const OrderZakaji = mongoose.model('OrderZakaji', OrderZakajiSchema);

module.exports = OrderZakaji;