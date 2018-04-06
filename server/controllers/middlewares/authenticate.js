
const user = require('../../models/user-model');

let authenticate = (req, res, next) => {
    let token = req.header('x-auth');

    user.findByToken(token).then((user)=>{
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