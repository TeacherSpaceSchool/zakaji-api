const mongoose = require('mongoose');

const EmploymentZakajiSchema = mongoose.Schema({
    name: String,
    email: String,
    phone: [String],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserZakaji'
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationZakaji'
    },
    del: String,
}, {
    timestamps: true
});


const EmploymentZakaji = mongoose.model('EmploymentZakaji', EmploymentZakajiSchema);

module.exports = EmploymentZakaji;