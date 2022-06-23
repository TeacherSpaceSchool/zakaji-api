const mongoose = require('mongoose');

const DeliveryDateZakajiSchema = mongoose.Schema({
    days: {
        type: [Boolean],
        default: [true, true, true, true, true, true, true]
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClientZakaji'
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationZakaji'
    },
    priority: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true
});


const DeliveryDateZakaji = mongoose.model('DeliveryDateZakaji', DeliveryDateZakajiSchema);

module.exports = DeliveryDateZakaji;