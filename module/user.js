const UserZakaji = require('../models/userZakaji');
let adminId = '';
const adminLogin = require('./const').adminLogin,
    adminPass = require('./const').adminPass;


let getAdminId = () => {
    return adminId
}

let checkAdmin = async (role, status) => {
    return (role=='admin'&&status=='active')
}

module.exports.createAdmin = async () => {
    await UserZakaji.deleteMany({$or:[{login: 'admin', role: {$ne: 'admin'}}, {role: 'admin', login: {$ne: 'admin'}}]});
    let findAdmin = await UserZakaji.findOne({login: adminLogin})
    if(!findAdmin){
        const _user = new UserZakaji({
            login: adminLogin,
            role: 'admin',
            status: 'active',
            password: adminPass,
        });
        findAdmin = await UserZakaji.create(_user);
    }
    else if(!findAdmin.checkPassword(adminPass))
        await UserZakaji.updateOne({login: 'admin'}, {password: adminPass});
    adminId = findAdmin._id.toString();
}

module.exports.getAdminId = getAdminId;
module.exports.checkAdmin = checkAdmin;
