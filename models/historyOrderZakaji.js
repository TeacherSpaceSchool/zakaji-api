const mongoose = require('mongoose');

const HistoryOrderZakajiSchema = mongoose.Schema({
    invoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InvoiceZakaji'
    },
    orders: mongoose.Schema.Types.Mixed,
    editor: String,
}, {
    timestamps: true
});


const HistoryOrderZakaji = mongoose.model('HistoryOrderZakaji', HistoryOrderZakajiSchema);

module.exports = HistoryOrderZakaji;