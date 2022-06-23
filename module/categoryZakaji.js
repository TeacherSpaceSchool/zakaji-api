const CategoryZakaji = require('../models/categoryZakaji');
let categoryUndefinedId = '';
module.exports.reductionCategoryZakaji = async()=>{
    let categoryUndefined = await CategoryZakaji.findOne({name: 'Не задано'});
    if(!categoryUndefined) {
        let _object = new CategoryZakaji({
            image: '/static/add.png',
            name: 'Не задано',
            status: 'active'
        });
        categoryUndefined = await CategoryZakaji.create(_object)
    }
    categoryUndefinedId = categoryUndefined._id
}


module.exports.getCategoryUndefinedId = () => {
    return categoryUndefinedId
}