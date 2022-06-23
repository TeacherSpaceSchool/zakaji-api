const mongoose = require('mongoose');

const singleOutXMLAdsSchema = mongoose.Schema({
    guid: String,
    district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DistrictZakaji'
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationZakaji'
    },
    pass: String,

}, {
    timestamps: true
});


const singleOutXMLAds = mongoose.model('singleOutXMLAds', singleOutXMLAdsSchema);

module.exports = singleOutXMLAds;