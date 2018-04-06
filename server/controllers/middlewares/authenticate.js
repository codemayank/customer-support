
const customer = require('../../models/customer-model');

let authenticate = (req, res, next) => {
    let token = req.header('x-auth');

    customer.findByToken(token).then((customer)=>{
        if(!customer){
            return Promise.reject();
        }
        req.customer = customer;
        req.token = token;
        next() 
    }).catch((e) => {
        res.status(401).send();
    })
}

module.exports = authenticate;