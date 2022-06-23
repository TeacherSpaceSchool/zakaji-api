const mongoose = require('mongoose');

const TemplateFormZakajiSchema = mongoose.Schema({
    title: String,
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationZakaji'
    },
    editorEmployment: Boolean,
    editorClient: Boolean,
    edit: Boolean,
    questions: [{
        formType: String,
        question: String,
        answers: [String],
        obligatory: Boolean
    }]
}, {
    timestamps: true
});


const TemplateFormZakaji = mongoose.model('TemplateFormZakaji', TemplateFormZakajiSchema);

module.exports = TemplateFormZakaji;