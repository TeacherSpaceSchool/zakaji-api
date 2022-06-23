const DeliveryDateZakaji = require('../models/deliveryDateZakaji');

module.exports.reductionToDeliveryDate = async() => {
    let deliveryDates = await DeliveryDateZakaji.find({priority: null})
    console.log(`reductionToDeliveryDate: ${deliveryDates.length}`)
    for(let i = 0; i<deliveryDates.length;i++){
        deliveryDates[i].priority = 0
        await deliveryDates[i].save();
    }
}