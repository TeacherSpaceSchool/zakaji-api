const mongoose = require('mongoose');

const ClientZakajiSchema = mongoose.Schema({
    name: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    phone: [String],
    address: [[String]],
    sync:  {
        type: [String],
        default: []
    },
    info: {
        type: String,
        default: ''
    },
    lastActive: {
        type: Date,
        default: null
    },
    reiting: Number,
    image: String,
    category: {
        type: String,
        default: 'B'
    },
    city: String,
    device: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserZakaji'
    },
    notification: {
        type: Boolean,
        default: null
    },
    del: String,
}, {
    timestamps: true
});


const ClientZakaji = mongoose.model('ClientZakaji', ClientZakajiSchema);

module.exports = ClientZakaji;