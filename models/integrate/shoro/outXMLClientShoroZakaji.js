const mongoose = require('mongoose');

const outXMLClientShoroSchema = mongoose.Schema({
    guid: String,
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClientZakaji'
    },
    exc: String
}, {
    timestamps: true
});


const outXMLClientShoro = mongoose.model('outXMLClientShoro', outXMLClientShoroSchema);

module.exports = outXMLClientShoro;