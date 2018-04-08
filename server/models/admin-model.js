const User = require('./user-model'),
    mongoose = require('mongoose');


let adminSchema = new mongoose.Schema({
    admin_id : {type:Number, required:true, unique:true}
}, {discriminatorKey : 'userType'})


let Admin = User.discriminator('Admin', adminSchema);

module.exports = Admin;