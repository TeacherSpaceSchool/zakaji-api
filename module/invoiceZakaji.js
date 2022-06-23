const InvoiceZakaji = require('../models/invoiceZakaji');

module.exports.reductionInvoices = async() => {
    /*let invoices = await InvoiceZakaji.find({
        city: null
    })
    console.log('reductionInvoices:',invoices.length)*/
    await InvoiceZakaji.updateMany({city: null}, {city: 'Бишкек'});
    /*for (let i = 0; i < invoices.length; i++) {
        invoices[i].city = 'Бишкек'
        await invoices[i].save()
    }*/
}