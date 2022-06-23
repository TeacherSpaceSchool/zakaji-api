const mongoose = require('mongoose');

const AutoZakajiSchema = mongoose.Schema({
    number: String,
    tonnage: {
        type: Number,
        default: 0
    },
    size: {
        type: Number,
        default: 0
    },
    employment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmploymentZakaji'
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationZakaji'
    },
}, {
    timestamps: true
});


const AutoZakaji = mongoose.model('AutoZakaji', AutoZakajiSchema);

module.exports = AutoZakaji;