const express = require('express'),
      router = express.Router(),
    //   mongoose = require('mongoose'),
      customer = require('../models/customer-model'),
      _ = require('lodash'),
      authenticate = require('./middlewares/authenticate');


module.exports.controller = (app) =>{

    router.post('/customer-registration', (req, res) => {
        let body = _.pick(req.body, ['username', 'email', 'password', 'phoneNumber'])
        let newCustomer = new customer(body);

        newCustomer.save().then(() =>{
            return newCustomer.generateAuthToken();
        }).then((token)=>{
            res.header('x-auth', token).send(newCustomer);
        }).catch((e)=>{
            res.status(400).send(e)
        })
    })

    router.get('/me', authenticate, (req, res) => {
        res.send(req.customer);
    })
    app.use('/user' ,router);
}