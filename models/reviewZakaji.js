const mongoose = require('mongoose');

const ReviewZakajiSchema = mongoose.Schema({
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationZakaji'
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClientZakaji'
    },
    taken: Boolean,
    type: String,
    text: String
}, {
    timestamps: true
});


const ReviewZakaji = mongoose.model('ReviewZakaji', ReviewZakajiSchema);

module.exports = ReviewZakaji;