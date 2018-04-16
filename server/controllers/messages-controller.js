

const express = require('express'),
    router = express.Router(),
    ticket = require('../models/query-model'),
    message = require('../models/message-model'),
    user = require('../models/user-model')
    authenticate = require('./middlewares/authenticate'),
    queryEventEmitter = require('../lib/mailer'),
    _ = require('lodash');

module.exports.controller = (app) => {
    //route to submit replies to the admins answers
    router.post('/submit-message/:ticket_id', authenticate, (req, res) => {
        // console.log(req.body);
        let newMessage = req.body;
        newMessage.from = { id : req.user.id, username : req.user.username}
        // console.log(req.body);
        ticket.findOne({'_id' : req.params.ticket_id}).populate('messages').exec((err, ticket) => {
            // console.log('printing ticket', ticket);
            if (err) {
                // console.log('submit message : ticket find error')
                res.send(err);
            }if(!ticket){
                res.send('there was an error in retreiving the ticket at this moment.')
            } else {

                if(ticket._creator.id == req.user.id || req.user.tokens[0].access === 'adminAuth'){
                    message.create(newMessage, (err, message) => {
                        if (err) {
                            // console.log('submit message : create message error')
                            res.send(err);
                        } else {
                            ticket.messages.push(message);
                            ticket.save()
                            res.send({ticket});
                            //fire event to send e-mail to the user that they have received the response from an admin.
                            let userType = user.Admin
                            let queryValue = {}
                            if(req.user.tokens[0].access === 'adminAuth'){
                                userType = user.User
                                queryValue = {'email' : ticket.email}
                            }
                            queryEventEmitter.emit('messageSent', {message : message, ticket : ticket, db : userType, queryValue : queryValue});


                        }
                    })
                }else{
                    res.status(401).send("you do not have access to submit messages to this ticket.")
                }

            }
        });
    })

    //edit message route
    router.put('/edit-message/:query_id/:message_id', authenticate, (req, res) => {
        console.log('user_id', req.user._id)
        message.findByIdAndUpdate({ '_id': req.params.message_id, 'from.id': req.user.id }, { 'text': req.body.text }, (err, updatedMessage) => {
            if (err) {
                // // console.log('edit-message: edit message error');
                res.send(err)
            } else {
                ticket.findOne({ '_id': req.params.query_id }).populate('messages').exec((err, ticket) => {
                    if (err) {
                        // console.log('could not find ticket');
                    } else {
                        res.send({ticket});
                    }
                })
            }
        })
    });

    //delete message route
    router.delete('/delete-message/:message_id', authenticate, (req, res) => {
        message.findByIdAndRemove({'_id' : req.params.message_id, 'from.id' : req.user.id}, (err) => {
            if (err) {
                // console.log("message delete error");
                res.send("there was an error in deleting the message at this time");
                //fire event to let the user know that their message was not deleted. 
            } else {
                res.send('message deleted successfully');

            }
        })
    })

    app.use('/query', router);
}

