const mongoose = require('mongoose');
const SubBrandZakajiSchema = mongoose.Schema({
    image: String,
    miniInfo: String,
    status: String,
    name: String,
    priotiry: {
        type: Number,
        default: 0
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationZakaji'
    },
    del: String,
    cities: [String]
}, {
    timestamps: true
});

const SubBrandZakaji = mongoose.model('SubBrandZakaji', SubBrandZakajiSchema);


module.exports = SubBrandZakaji;