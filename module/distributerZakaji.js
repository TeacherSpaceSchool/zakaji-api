const DistributerZakaji = require('../models/distributerZakaji');
module.exports.startDistributerZakaji = async()=>{
    let distributerZakaji = await DistributerZakaji.findOne({distributer: null});
    if(!distributerZakaji) {
        let categoryUndefined = await CategoryZakaji.findOne({name: 'Не задано'});
        let _object = new SubCategoryZakaji({
            category: categoryUndefined._id,
            name: 'Не задано',
            status: 'active'
        });
        subCategoryyUndefined = await SubCategoryZakaji.create(_object)
    }
    subCategoryUndefinedId = subCategoryyUndefined._id
}