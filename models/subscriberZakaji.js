const mongoose = require('mongoose');

const SubscriberZakajiSchema = mongoose.Schema({
    endpoint: String,
    keys: mongoose.Schema.Types.Mixed,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserZakaji'
    },
    number: String,
    status: String,
}, {
    timestamps: true
});

const SubscriberZakaji = mongoose.model('SubscriberZakaji', SubscriberZakajiSchema);

module.exports = SubscriberZakaji;