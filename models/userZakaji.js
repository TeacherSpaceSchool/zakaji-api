const mongoose = require('mongoose');
const crypto = require('crypto');
const uniqueValidator = require('mongoose-unique-validator');

const userZakajiSchema = mongoose.Schema({
    login: {
        type: String,
        required: true,
        unique: true
    },
   // phone: String,
    role: String,
    status: String,
    passwordHash: String,
    salt: String,
}, {
    timestamps: true
});

userZakajiSchema.virtual('password')
    .set(function (password) {
        this._plainPassword = password;
        if (password) {
            this.salt = crypto.randomBytes(128).toString('base64');
            this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1');
        } else {
            this.salt = undefined;
            this.passwordHash = undefined;
        }
    })
    .get(function () {
        return this._plainPassword;
    });

userZakajiSchema.methods.checkPassword = function (password) {
    if (!password) return false;
    if (!this.passwordHash) return false;
    return crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1') == this.passwordHash;
};

userZakajiSchema.plugin(uniqueValidator);

const UserZakaji = mongoose.model('UserZakaji', userZakajiSchema);
/*
UserZakaji.collection.dropIndex('phone_1', function(err, result) {
    if (err) {
        console.log('Error in dropping index!', err);
    }
});*/

module.exports = UserZakaji;