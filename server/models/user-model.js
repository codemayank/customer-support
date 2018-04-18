const bcrypt = require('bcryptjs'),
      mongoose = require('mongoose'),
      validator = require('validator'),
      jwt = require('jsonwebtoken'),
      crypto = require('crypto'),
      nodemailer = require('nodemailer'),
      _ = require('lodash'),
      jwtSecret = 'Random_Secret'; //specify the secret to be used for generating the jwt token.

//import email auth credentials
const emailAuth = require('../env.js');

//specify base schema for user and admins.
let UserSchema = function (add) {
      let Schema = new mongoose.Schema({
            username: {
                  type: String,
                  required: true,
                  unique: true
            },
            email: {
                  type: String,
                  required: true,
                  unique: true,
                  validate: {
                        validator: validator.isEmail,
                        message: '{VALUE} is not  a valid e-mail.'
                  }
            },
            phoneNumber: {
                  type: Number,
                  required: true,
                  unique: true,
                  validate: {
                        validator: function(v){
                              return /^\d{10}$/.test(v);
                        },
                        message : '{VALUE} is not a valid Phone Number!'
                  }
            },
            password: {
                  type: String,
                  required: true,
                  minlength: 6,

            },
            tokens: [{
                  access: {
                        type: String,
                        required: true
                  },
                  token: {
                        type: String,
                        required: true
                  }
            }],
            resetPasswordToken: String,
            resetPasswordExpires: Date
      });
      //schema method to send only specific data to the client.
      Schema.methods.toJSON = function () {
            let user = this;
            let userObject = user.toObject();
            userObject.roles = ['userAuth'];
            if(userObject.tokens[0].access === 'adminAuth'){
                  userObject.roles.push('adminAuth')
            }

            return _.pick(userObject, ['_id', 'username', 'roles']);
      }

      //schema method to generate the authentication token.
      Schema.methods.generateAuthToken = function (userAccess) {
            let user = this;
            let access = userAccess;
            let token = jwt.sign({
                  _id: user._id.toHexString(),
                  access
            }, jwtSecret, {expiresIn : '7d'}).toString(); //use jwt to generate new token. generated token expires in 7 days.

            if (user.tokens.length != 0) {
                  user.tokens.splice(0, 1);
            }
            user.tokens = user.tokens.concat([{
                  access,
                  token
            }]);

            return user.save().then(() => {
                  return token;
            });
      }
      //schema method to remove token.
      Schema.methods.removeToken = function (token) {
            let user = this;
            return user.update({
                  $pull: {
                        tokens: {
                              token
                        }
                  }
            });
      };

      //schema method to create reset password token.
      Schema.statics.createResetPasswordToken = function (email, host) {
            if(emailAuth.useEmail){
                  let User = this;
            let buf = crypto.randomBytes(20);
            let token = buf.toString('hex');
            return User.findOne({
                        'email': email
                  })
                  .then((user) => {
                        if (!User) {
                              return Promise.reject(`no User with email-id ${email} exists`);
                        }
                        user.resetPasswordToken = token;
                        user.resetPasswordExpires = Date.now() + 3600000;
                        return user.save().then(() => {
                              return user
                        })
                  })
                  .then((user) => {
                        let smtpTransport = nodemailer.createTransport({
                              service: emailAuth.service,
                              auth: emailAuth.auth
                        });
                        let mailOptions = {
                              to: user.email,
                              from: 'passwordreset@demo.com',
                              subject: 'Password reset',
                              text: 'password Reset mail \n\n' + 'use the below token to reset yout password\n\n' + 
                                    token
                                    
        
                        }
        
                        return smtpTransport.sendMail(mailOptions).then(() => {
                              return {
                                    message: 'email sent.'
                              }
                        })
                  })
            }else{
                  return 'email service has been disabled. so password reset cannot be used.';
            }
        }

        //schema method to change the password
        Schema.statics.changePassword = function(token, newPassword){
            if(emailAuth.useEmail){
                  let User = this;
                  return User.findOne({
                        resetPasswordToken : token,
                        resetPasswordExpires : {
                              $gt : Date.now()
                        }
                  }).then((user)=>{
                        if(!user){
                              return Promise.reject('password reset token is invalid or has expired.')
                        }
                        user.password = newPassword;
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;
      
                        return user.save().then(()=>{
                              return user;
                        })
                        
                  })
                  .then((user)=>{
                        let smtpTransport = nodemailer.createTransport({
                              service: emailAuth.service,
                              auth: emailAuth.auth
                        });
                        let mailOptions = {
                              to : user.email,
                              from : 'passwordreset@demo.com',
                              subject : 'Your Password has been changed',
                              text : 'Your password has been changed successfully'
                        }
                        return smtpTransport.sendMail(mailOptions).then(()=>{
                              return {message : 'password successfully changed.'}
                        })
                  })
            }else{
                  return 'email service has been disabled. so password reset cannot be used.';
            }

      }

      //schema method to verify the jwt token.
      Schema.statics.findByToken = function (token) {
            let User = this;
            let decoded;

            try {
                  decoded = jwt.verify(token, jwtSecret);
                  // console.log(decoded);
            } catch (e) {
                  return Promise.reject();
            }
            return User.findOne({
                  '_id': decoded._id,
                  'tokens.token': token,
                  'tokens.access': decoded.access
            })

      }

      //schema method to verify the login credentials of the user / admin.
      Schema.statics.findByCredentials = function (password, username = 0, admin_id = 0) {
            let User = this;
            return User.findOne({
                  $or: [{
                        username
                  }, {
                        admin_id
                  }]
            }).then((user) => {
                  if (!user) {
                        let message = "Loginerr1";
                        return Promise.reject(message);
                  }
                  return new Promise((resolve, reject) => {
                        bcrypt.compare(password, user.password, (err, res) => {
                              if (res) {
                                    resolve(user);
                              } else {
                                    reject('Loginerr2');
                              }
                        })
                  })
            })
      }

      //Encrypt password before saving to the database.
      Schema.pre('save', function (next) {
            let user = this;

            if (user.isModified('password')) {
                  let password = user.password;
                  bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(password, salt, (err, hash) => {
                              user.password = hash;
                              next();
                        })
                  })
            } else {
                  next()
            }
      })

      if (add) {
            Schema.add(add);
      }

      return Schema;
}

//specify user schema
let userSchema = new UserSchema();
let User = mongoose.model('User', userSchema);

//specify admin schema with addition of admin_id property to the base schema.
let adminSchema = new UserSchema({
      admin_id: {
            type: Number,
            required: true,
            unique: true
      }
});
let Admin = mongoose.model('Admin', adminSchema);
module.exports = {
      User: User,
      Admin: Admin
};