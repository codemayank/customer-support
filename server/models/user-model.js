const bcrypt = require('bcryptjs'),
      mongoose = require('mongoose'),
      validator = require('validator'),
      jwt = require('jsonwebtoken'),
      _ = require('lodash');



let userSchema = new mongoose.Schema({
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
      }],
      
}, {discriminatorKey : 'userType'});

userSchema.methods.toJSON = function () {
      let user = this;
      let userObject = user.toObject();

      return _.pick(userObject, ['_id', 'username']);
}

userSchema.methods.generateAuthToken = function (userAccess) {
      let user = this;
      let access = userAccess;
      let token = jwt.sign({ _id: user._id.toHexString(), access }, 'secret').toString();

      user.tokens = user.tokens.concat([{ access, token }]);

      return user.save().then(() => {
            return token;
      });
}

userSchema.methods.removeToken = function (token) {
      let user = this;
      return user.update({
            $pull: {
                  tokens: { token }
            }
      });
};

userSchema.statics.findByToken = function (token) {
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

userSchema.statics.findByCredentials = function (username, password) {
      let User = this;
      return User.findOne({ username }).then((user) => {
            if (!user) {
                  return Promise.reject()
            }
            return new Promise((resolve, reject) => {
                  bcrypt.compare(password, user.password, (err, res) => {
                        if (res) {
                              resolve(user);
                        } else {
                              reject();
                        }
                  })
            })
      })
}

userSchema.pre('save', function (next) {
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

let User = mongoose.model('User', userSchema)

module.exports = User;


