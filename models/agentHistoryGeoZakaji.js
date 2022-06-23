const mongoose = require('mongoose');

const AgentHistoryGeoZakajiSchema = mongoose.Schema({
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmploymentZakaji'
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClientZakaji'
    },
    geo: String
}, {
    timestamps: true
});


const AgentHistoryGeoZakaji = mongoose.model('AgentHistoryGeoZakaji', AgentHistoryGeoZakajiSchema);

module.exports = AgentHistoryGeoZakaji;