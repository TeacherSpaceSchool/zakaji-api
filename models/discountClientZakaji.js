const mongoose = require('mongoose');

const DiscountClientZakajiSchema = mongoose.Schema({
    discount: Number,
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

DiscountClientZakajiSchema.index({client: 1})
DiscountClientZakajiSchema.index({organization: 1})

const DiscountClientZakaji = mongoose.model('DiscountClientZakaji', DiscountClientZakajiSchema);

module.exports = DiscountClientZakaji;