const mongoose = require('mongoose');

const RepairEquipmentZakajiSchema = mongoose.Schema({
    number: String,
    status: String,
    equipment: String,
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClientZakaji'
    },
    repairMan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmploymentZakaji'
    },
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmploymentZakaji'
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationZakaji'
    },
    accept: {
        type: Boolean,
        default: false
    },
    done: {
        type: Boolean,
        default: false
    },
    cancel: {
        type: Boolean,
        default: false
    },
    defect: [String],
    repair: [String],
    dateRepair: Date,
}, {
    timestamps: true
});


const RepairEquipmentZakaji = mongoose.model('RepairEquipmentZakaji', RepairEquipmentZakajiSchema);

module.exports = RepairEquipmentZakaji;