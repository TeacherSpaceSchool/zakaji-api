const mongoose = require('mongoose');

const NotificationStatisticZakajiSchema = mongoose.Schema({
    tag: String,
    url: String,
    icon: String,
    title: String,
    text: String,
    delivered: Number,
    failed: Number,
    click: {
        type: Number,
        default: 0
    },
    ips: {
        type: [String],
        default: []
    },
    who: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserZakaji'
    },
}, {
    timestamps: true
});


const NotificationStatisticZakaji = mongoose.model('NotificationStatisticZakaji', NotificationStatisticZakajiSchema);

module.exports = NotificationStatisticZakaji;