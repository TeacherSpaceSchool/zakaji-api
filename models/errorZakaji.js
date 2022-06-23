const mongoose = require('mongoose');

const ErrorZakajiSchema = mongoose.Schema({
    err: String,
    path: String,
}, {
    timestamps: true
});

const ErrorZakaji = mongoose.model('ErrorZakaji', ErrorZakajiSchema);

module.exports = ErrorZakaji;