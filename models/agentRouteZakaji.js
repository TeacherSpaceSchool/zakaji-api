const mongoose = require('mongoose');

const AgentRouteZakajiSchema = mongoose.Schema({
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationZakaji'
    },
    clients: [[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClientZakaji'
    }]],
    name: String,
    district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DistrictZakaji'
    }
}, {
    timestamps: true
});


const AgentRouteZakaji = mongoose.model('AgentRouteZakaji', AgentRouteZakajiSchema);

module.exports = AgentRouteZakaji;