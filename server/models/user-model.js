const bcrypt = require('bcryptjs'),
      mongoose = require('mongoose'),
      validator = require('validator'),
      jwt = require('jsonwebtoken'),
      _ = require('lodash');

let UserSchema = function(add){
      let Schema = new mongoose.Schema({
            username: { type: String, required: true, unique: true },
            email: {
                  type: String,
                  required: true,
                  unique: true,
                  validate: {
                        validator: validator.isEmail,
                        message: '{VALUE} is not  a valid e-mail.'
                  }
            },
            phoneNumber: { type: Number, required: true, unique: true },
            password: {
                  type: String,
                  required: true,
                  minlength: 6,

            },
            tokens: [{
                  access: { type: String, required: true },
                  token: { type: String, required: true }
            }]
      });

      Schema.methods.toJSON = function () {
            let user = this;
            let userObject = user.toObject();

            return _.pick(userObject, ['_id', 'username']);
      }

      Schema.methods.generateAuthToken = function (userAccess) {
            let user = this;
            let access = userAccess;
            let token = jwt.sign({ _id: user._id.toHexString(), access }, 'secret').toString();

            user.tokens = user.tokens.concat([{ access, token }]);

            return user.save().then(() => {
                  return token;
            });
      }

      Schema.methods.removeToken = function (token) {
            let user = this;
            return user.update({
                  $pull: {
                        tokens: { token }
                  }
            });
      };

      Schema.statics.findByToken = function (token) {
            let User = this;
            let decoded;

            try {
                  decoded = jwt.verify(token, 'secret');
                  console.log(decoded);
            } catch (e) {
                  return Promise.reject();
            }
            return User.findOne({
                  '_id': decoded._id,
                  'tokens.token': token,
                  'tokens.access': decoded.access
            })

      }

      Schema.statics.findByCredentials = function (password, username = 0, admin_id = 0) {
            let User = this;
            return User.findOne({$or : [{ username }, {admin_id}]}).then((user) => {
                  console.log(user)
                  if (!user) {
                        let message = "user Not found.";
                        return Promise.reject(message);
                  }
                  return new Promise((resolve, reject) => {
                        bcrypt.compare(password, user.password, (err, res) => {
                              if (res) {
                                    resolve(user);
                                    console.log('user resolved i.e. password matches');
                              } else {
                                    reject();
                              }
                        })
                  })
            })
      }

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

      if(add){
            Schema.add(add);
      }

      return Schema;
}

let userSchema = new UserSchema();
let User = mongoose.model('User', userSchema);
let adminSchema = new UserSchema({admin_id : {type:Number, required:true, unique:true}});
let Admin = mongoose.model('Admin', adminSchema);
module.exports = {User : User, Admin : Admin};
