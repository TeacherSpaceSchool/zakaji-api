const mongoose = require('mongoose');

const FormZakajiSchema = mongoose.Schema({
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationZakaji'
    },
    templateForm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TemplateFormZakaji'
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClientZakaji'
    },
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmploymentZakaji'
    },
    questions: [{
        formType: String,
        question: String,
        answer: [String],
        answers: [String],
        obligatory: Boolean
    }]
}, {
    timestamps: true
});


const FormZakaji = mongoose.model('FormZakaji', FormZakajiSchema);

module.exports = FormZakaji;