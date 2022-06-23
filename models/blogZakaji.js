const mongoose = require('mongoose');

const BlogZakajiSchema = mongoose.Schema({
    title: String,
    text: String,
    image: String,
}, {
    timestamps: true
});


const BlogZakaji = mongoose.model('BlogZakaji', BlogZakajiSchema);

module.exports = BlogZakaji;