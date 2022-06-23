const mongoose = require('mongoose');

const ConnectionApplicationZakajiSchema = mongoose.Schema({
    name: String,
    phone: String,
    address: String,
    whereKnow: String,
    taken: Boolean
}, {
    timestamps: true
});


const ConnectionApplicationZakaji = mongoose.model('ConnectionApplicationZakaji', ConnectionApplicationZakajiSchema);

module.exports = ConnectionApplicationZakaji;