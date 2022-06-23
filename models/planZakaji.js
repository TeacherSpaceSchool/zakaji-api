const mongoose = require('mongoose');

const PlanZakajiSchema = mongoose.Schema({
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationZakaji'
    },
    target: {
        type: Number,
        default: 0
    },
    added: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const PlanZakaji = mongoose.model('PlanZakaji', PlanZakajiSchema);

module.exports = PlanZakaji;