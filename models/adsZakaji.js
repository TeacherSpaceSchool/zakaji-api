const mongoose = require('mongoose');
const random = require('mongoose-random');

const AdsZakajiSchema = mongoose.Schema({
    image: String,
    url: String,
    xid: {
        type: String,
        default: ''
    },
    xidNumber: {
        type: Number,
        default: 0
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationZakaji'
    },
    del: String,
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ItemZakaji'
    },
    count: {
        type: Number,
        default: 0
    },
    title: String,
    targetItems: [{
        xids: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ItemZakaji',
            default: []
        }],
        count: {
            type: Number,
            default: 0
        },
        sum: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: 'Количество'
        },
        targetPrice: {
            type: Number,
            default: 0
        },
    }],
    targetPrice: {
        type: Number,
        default: 0
    },
    multiplier: {
        type: Boolean,
        default: false
    },
    targetType: {
        type: String,
        default: 'Цена'
    },
}, {
    timestamps: true
});

AdsZakajiSchema.plugin(random, { path: 'r' });

const AdsZakaji = mongoose.model('AdsZakaji', AdsZakajiSchema);

module.exports = AdsZakaji;