const mongoose = require('mongoose');

const LotteryZakajiSchema = mongoose.Schema({
    image: String,
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationZakaji'
    },
    status: String,
    text: String,
    date: Date,
    prizes: [{
        image: String,
        name: String,
        count:  Number
    }],
    photoReports: [{
        image: String,
        text: String,
    }],
    tickets: [{
        status: String,
        number: String,
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ClientZakaji'
        },
        prize: String
    }]
}, {
    timestamps: true
});

const LotteryZakaji = mongoose.model('LotteryZakaji', LotteryZakajiSchema);

module.exports = LotteryZakaji;