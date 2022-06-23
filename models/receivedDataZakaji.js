const mongoose = require('mongoose');

const ReceivedDataZakajiSchema = mongoose.Schema({
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationZakaji'
    },
    guid: String,
    name: String,
    addres: String,
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmploymentZakaji'
    },
    phone: String,
    type: String,
    status: String,
    position: String,
}, {
    timestamps: true
});

const ReceivedDataZakaji = mongoose.model('ReceivedDataZakaji', ReceivedDataZakajiSchema);

module.exports = ReceivedDataZakaji;