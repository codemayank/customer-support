

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
    router.post('/submit-message', authenticate, (req, res) => {
        let body = _.pick(req.body, ['ticket_id', "message"]);
        req.body.message.from = { id : req.user.id, username : req.user.username}
        ticket.findOne({'_id' : req.body.ticket_id}, (err, ticket) => {
            if (err) {
                console.log('submit message : ticket find error')
                res.send(err);
            }if(!ticket){
                res.send('there was an error in retreiving the ticket at this moment.')
            } else {

                if(ticket._creator.id == req.user.id || req.user.tokens[0].access === 'adminAuth'){
                    message.create(req.body.message, (err, message) => {
                        if (err) {
                            console.log('submit message : create message error')
                            res.send(err);
                        } else {
                            message.from.id = req.user._id;
                            message.from.username = req.user.username;
                            message.save();
                            ticket.messages.push(message);
                            ticket.save()
                            res.send('message successfully added');
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
    router.put('/edit-message', authenticate, (req, res) => {
        message.findByIdAndUpdate({'_id' : req.body.id, 'from.id' : req.user.id}, {'text' : req.body.text}, (err, updatedMessage) => {
            if (err) {
                console.log('edit-message: edit message error');
                res.send(err)
            } else {
                res.send('your message has been successfully edited')
            }
        });
    });

    //delete message route
    router.delete('/delete-message', authenticate, (req, res) => {
        message.findByIdAndRemove({'_id' : req.body.id, 'from.id' : req.user.id}, (err) => {
            if (err) {
                console.log("message delete error");
                res.send("there was an error in deleting the message at this time");
                //fire event to let the user know that their message was not deleted. 
            } else {
                res.send('message deleted successfully');

            }
        })
    })

    app.use('/query', router);
}

