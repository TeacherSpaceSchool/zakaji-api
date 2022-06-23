const SubCategoryZakaji = require('../models/subCategoryZakaji');
const CategoryZakaji = require('../models/categoryZakaji');
let subCategoryUndefinedId = '';
module.exports.reductionSubCategoryZakaji = async()=>{
    let subCategoryyUndefined = await SubCategoryZakaji.findOne({name: 'Не задано'});
    if(!subCategoryyUndefined) {
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


module.exports.getSubCategoryUndefinedId = () => {
    return subCategoryUndefinedId
}