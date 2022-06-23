const mongoose = require('mongoose');

const subCategoryZakajiSchema = mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CategoryZakaji'
    },
    name: String,
    status: String,
}, {
    timestamps: true
});


const subCategoryZakaji = mongoose.model('SubCategoryZakaji', subCategoryZakajiSchema);

module.exports = subCategoryZakaji;