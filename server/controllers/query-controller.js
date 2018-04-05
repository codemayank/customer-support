const express = require('express'),
      router = express.Router(),
      mongoose = require('mongoose'),
      ticket = mongoose.model('Ticket'),
      _ = require('lodash');

module.exports.controller = (app) => {

    router.post('/submit-query', (req, res) =>{
        let newTicket = new ticket({
            name : req.body.name,
            email : req.body.email,
            phoneNumber : req.body.phoneNumber,
            qTitle : req.body.qTitle,
            qDescription : req.body.qDescription,
            resolved : false,
            createdAt : new Date().getTime()
        });
        newTicket.save((err)=>{
            if(err){
                console.log('There was an error in saving your query at this time.');
            }
            res.send(newTicket);
        });
    });

    // router.get('show-queries', (req, res){

    // })

    app.use(router);
}