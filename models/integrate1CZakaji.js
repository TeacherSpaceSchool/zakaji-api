const mongoose = require('mongoose');

const Integrate1CZakajiSchema = mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ItemZakaji'
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClientZakaji'
    },
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmploymentZakaji'
    },
    ecspeditor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmploymentZakaji'
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmploymentZakaji'
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationZakaji'
    },
    guid: String,
}, {
    timestamps: true
});


const Integrate1CZakaji = mongoose.model('Integrate1CZakaji', Integrate1CZakajiSchema);

module.exports = Integrate1CZakaji;