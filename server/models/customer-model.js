const bcrypt   = require('bcryptjs'),
      mongoose = require('mongoose'),
      validator = require('validator'),
      jwt = require('jsonwebtoken'),
      _ = require('lodash');

let customerSchema = new mongoose.Schema({
    username : {type :String, required : true, unique : true},
    email : {type : String, 
            required : true, 
            unique : true,
            validate : {
                  validator : validator.isEmail,
                  message : '{VALUE} is not  a valid e-mail.'
            }
      },
    phoneNumber : {type : String, required : true, unique : true},
    password : {type : String, 
                required : true,
                minlength : 6,

      },
    tokens : [{
          access : {type : String, required : true},
          token : {type : String, required : true}
    }]

})

customerSchema.methods.toJSON = function(){
      let customer = this;
      let customerObject = customer.toObject();

      return _.pick(customerObject, ['_id', 'username']);
}

customerSchema.methods.generateAuthToken = function(){
      let customer = this;
      let access = 'auth';
      let token = jwt.sign({_id: customer._id.toHexString(), access}, 'secret').toString();

      customer.tokens = customer.tokens.concat([{access, token}]);

      return customer.save().then(()=>{
            return token;
      });
}

mongoose.model('Customer', customerSchema);
