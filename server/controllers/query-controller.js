const express = require('express'),
      router = express.Router(),
      ticket = require('../models/query-model'),
      _ = require('lodash'),
      authenticate = require('../controllers/middlewares/authenticate');

module.exports.controller = (app) => {

    router.post('/submit-query', authenticate, (req, res) =>{
        let newTicket = new ticket({
            name : req.user.username,
            email : req.user.email,
            phoneNumber : req.user.phoneNumber,
            qTitle : req.body.qTitle,
            qDescription : req.body.qDescription,
            resolved : false,
            createdAt : new Date().getTime(),
            _creator : req.user._id
        });
        newTicket.save((err)=>{
            if(err){
                console.log('There was an error in saving your query at this time.', err);
            }
            res.send(newTicket);
        });
    });

    router.get('/show-queries', authenticate, (req, res) => {
        ticket.find({
            _creator : req.user._id
        }).then((tickets)=>{
            res.send({tickets});
        }, (e) =>{
            res.status(400).send(e);
        });
    })

    // router.get('show-queries', (req, res){

    // })

    app.use('/query',router);
}