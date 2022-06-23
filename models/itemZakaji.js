const mongoose = require('mongoose');

const ItemZakajiSchema = mongoose.Schema({
    unit: {
        type: String,
        default: ''
    },
    name: String,
    image: String,
    price: Number,
    costPrice: {
        type: Number,
        default: 0
    },
    packaging:  {
        type: Number,
        default: 1
    },
    reiting: Number,
    apiece: {
        type: Boolean,
        default: false
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategoryZakaji'
    },
    subBrand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubBrandZakaji'
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationZakaji'
    },
    hit: Boolean,
    latest: Boolean,
    del: String,
    status: String,
    info: String,
    categorys: [String],
    city: String,
    weight: {
        type: Number,
        default: 0
    },
    priotiry: {
        type: Number,
        default: 0
    },
    size: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});


const ItemZakaji = mongoose.model('ItemZakaji', ItemZakajiSchema);

module.exports = ItemZakaji;