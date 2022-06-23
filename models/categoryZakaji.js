const mongoose = require('mongoose');

const CategoryZakajiSchema = mongoose.Schema({
    name: String,
    image: String,
    status: String,
}, {
    timestamps: true
});


const CategoryZakaji = mongoose.model('CategoryZakaji', CategoryZakajiSchema);

module.exports = CategoryZakaji;