const ItemZakaji = require('../models/itemZakaji');

module.exports.reductionToItem = async() => {
    let items = await ItemZakaji.find({city: {$ne: 'Бишкек'}})
    console.log(`reductionToItem: ${items.length}`)
    for(let i = 0; i<items.length;i++){
        items[i].city = 'Бишкек'
        await items[i].save();
    }
}