
const user = require('../../models/user-model');
const ticket = require('../../models/query-model');
const message = require('../../models/message-model');

let authenticate = (req, res, next) => {
    let token = req.header('x-auth');
    let type = req.header('x-userType');
    let userType = user.User;
    console.log(type);
    if(type == 'Admin'){
        userType = user.Admin
    }

    userType.findByToken(token).then((user)=>{
        if(!user){
            return Promise.reject();
        }
        req.user = user;
        req.token = token;
        next() 
    }).catch((e) => {
        res.status(401).send();
    })
}

module.exports = authenticate;