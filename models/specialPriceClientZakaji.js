const mongoose = require('mongoose');

const SpecialPriceClientZakajiSchema = mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ItemZakaji'
    },
    price: Number,
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClientZakaji'
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationZakaji'
    },
}, {
    timestamps: true
});

SpecialPriceClientZakajiSchema.index({client: 1})
SpecialPriceClientZakajiSchema.index({organization: 1})

const SpecialPriceClientZakaji = mongoose.model('SpecialPriceClientZakaji', SpecialPriceClientZakajiSchema);

module.exports = SpecialPriceClientZakaji;