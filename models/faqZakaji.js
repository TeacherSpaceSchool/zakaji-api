const mongoose = require('mongoose');

const FaqZakajiSchema = mongoose.Schema({
    url: String,
    title: String,
    video: String,
    typex:  {
        type: String,
        default: 'клиенты'
    },
    civic:  {
        type: String,
        default: 'клиенты'
    },
}, {
    timestamps: true
});

const FaqZakaji = mongoose.model('FaqZakaji', FaqZakajiSchema);

module.exports = FaqZakaji;