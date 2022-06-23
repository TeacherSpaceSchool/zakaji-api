const RouteZakaji = require('../models/routeZakaji');
const InvoiceZakaji = require('../models/invoiceZakaji');

module.exports.reductionToRoute = async() => {
    await RouteZakaji.deleteMany()
    await InvoiceZakaji.updateMany({}, {distributed: false})
}