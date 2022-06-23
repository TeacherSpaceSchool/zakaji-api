const mongoose = require('mongoose');

const DistrictZakajiSchema = mongoose.Schema({
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationZakaji'
    },
    client: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClientZakaji'
    }],
    name: String,
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
}, {
    timestamps: true
});


const DistrictZakaji = mongoose.model('DistrictZakaji', DistrictZakajiSchema);

module.exports = DistrictZakaji;