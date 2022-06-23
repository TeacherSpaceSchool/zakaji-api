const mongoose = require('mongoose');

const HistoryReturnedZakajiSchema = mongoose.Schema({
    returned: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ReturnedZakaji'
    },
    editor: String,
}, {
    timestamps: true
});


const HistoryReturnedZakaji = mongoose.model('HistoryReturnedZakaji', HistoryReturnedZakajiSchema);

module.exports = HistoryReturnedZakaji;