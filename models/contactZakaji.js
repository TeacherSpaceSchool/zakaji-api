const mongoose = require('mongoose');

const ContactZakajiSchema = mongoose.Schema({
    name: String,
    image: String,
    address: [String],
    email: [String],
    phone: [String],
    info: String,
    warehouse:  {
        type: String,
        default: ''
    },
    social: mongoose.Schema.Types.Mixed,
}, {
    timestamps: true
});


const ContactZakaji = mongoose.model('ContactZakaji', ContactZakajiSchema);

module.exports = ContactZakaji;