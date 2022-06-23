const mongoose = require('mongoose');

const DeliveryZakajiSchema = mongoose.Schema({
    free: Number,
    spec: Number,
    normal: Number,
}, {
    timestamps: true
});


const DeliveryZakaji = mongoose.model('DeliveryZakaji', DeliveryZakajiSchema);

module.exports = DeliveryZakaji;