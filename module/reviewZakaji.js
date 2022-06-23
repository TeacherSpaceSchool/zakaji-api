const ReviewZakaji = require('../models/reviewZakaji');
const OrganizationZakaji = require('../models/organizationZakaji');

module.exports.reductionReviews = async() => {
    let organizations = await OrganizationZakaji.find().distinct('_id').lean()
    console.log('reductionReviews:', await ReviewZakaji.deleteMany({organization: {$nin: organizations}}))
}