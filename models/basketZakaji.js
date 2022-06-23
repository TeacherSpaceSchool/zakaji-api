const mongoose = require('mongoose');

const BasketZakajiSchema = mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ItemZakaji'
    },
    count: Number,
    specialPrice: Number,
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClientZakaji'
    },
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmploymentZakaji'
    },
    consignment: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true
});


const BasketZakaji = mongoose.model('BasketZakaji', BasketZakajiSchema);

module.exports = BasketZakaji;