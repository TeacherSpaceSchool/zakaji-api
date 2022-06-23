const mongoose = require('mongoose');

const CashbackZakajiSchema = mongoose.Schema({
    free: Number,
    spec: Number,
    normal: Number,
}, {
    timestamps: true
});


const CashbackZakaji = mongoose.model('CashbackZakaji', CashbackZakajiSchema);

module.exports = CashbackZakaji;