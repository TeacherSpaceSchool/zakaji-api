const ReturnedZakaji = require('../models/returnedZakaji');
const SubBrandZakaji = require('../models/subBrandZakaji');

module.exports.reductionReturneds = async() => {
    /*let invoices = await InvoiceZakaji.find({
        city: null
    })
    console.log('reductionInvoices:',invoices.length)*/
    let subBrands = await SubBrandZakaji.find()
        .distinct('_id')
        .lean()
    await ReturnedZakaji.deleteMany({organization: {$in: subBrands}});
    /*for (let i = 0; i < invoices.length; i++) {
        invoices[i].city = 'Бишкек'
        await invoices[i].save()
    }*/
}