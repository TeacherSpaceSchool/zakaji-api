const mongoose = require('mongoose');

const MerchandisingZakajiSchema = mongoose.Schema({
    employment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmploymentZakaji'
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationZakaji'
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClientZakaji'
    },
    date: Date,
    productAvailability: [String],
    productInventory: Boolean,
    productConditions: Number,
    productLocation: Number,
    images: [String],
    fhos: mongoose.Schema.Types.Mixed,
    needFho: Boolean,
    check: Boolean,
    stateProduct: Number,
    comment: String,
    geo: String,
    reviewerScore: {
        type: Number,
        default: 0
    },
    reviewerComment: {
        type: String,
        default: ''
    },
}, {
    timestamps: true
});

MerchandisingZakajiSchema.index({date: 1})
MerchandisingZakajiSchema.index({stateProduct: 1})
MerchandisingZakajiSchema.index({check: 1})
MerchandisingZakajiSchema.index({organization: 1});
MerchandisingZakajiSchema.index({client: 1});
MerchandisingZakajiSchema.index({employment: 1});

const MerchandisingZakaji = mongoose.model('MerchandisingZakaji', MerchandisingZakajiSchema);

module.exports = MerchandisingZakaji;