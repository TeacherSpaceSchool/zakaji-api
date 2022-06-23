const mongoose = require('mongoose');

const DistributerZakajiSchema = mongoose.Schema({
    distributer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationZakaji'
    },
    sales: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationZakaji'
    }],
    provider: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationZakaji'
    }],
}, {
    timestamps: true
});


const DistributerZakaji = mongoose.model('DistributerZakaji', DistributerZakajiSchema);

module.exports = DistributerZakaji;