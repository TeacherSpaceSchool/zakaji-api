const RepairEquipmentZakaji = require('../models/repairEquipmentZakaji');

module.exports.reductionRepairEquipment = async() => {
    let date = new Date('2022-03-01T03:00:00.000Z')
    console.log('RepairEquipmentZakaji delete:', await RepairEquipmentZakaji.deleteMany({createdAt: {$lte: date}}))
}