const express = require('express'),
    router = express.Router(),
    ticket = require('../models/query-model'),
    message = require('../models/message-model'),
    authorisation = require('./middlewares/authenticate');

module.exports.controller = (app) => {
    //route to submit replies to the admins answers
    router.post('/submit-message', authorisation.checkTicketAccess('submitMessage'), (req, res) => {
        ticket.findById(req.body.id, (err, ticket) => {
            if (err) {
                console.log('submit message : ticket find error')
                res.send(err);
            } else {
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
                    }
                })
            }
        });
    })

    //edit message route
    router.put('/edit-message', authorisation.checkMessageOwnerShip, (req, res) => {
        message.findByIdAndUpdate(req.body.id, req.body.message, (err, updatedMessage) => {
            if (err) {
                console.log('edit-message: edit message error');
                res.send(err)
            } else {
                res.send('your message has been successfully edited')
            }
        });
    });

    //delete message route
    router.delete('/delete-message', authorisation.checkMessageOwnerShip, (req, res) => {
        message.findByIdAndRemove(req.body.message_id, (err) => {
            if (err) {
                console.log("message delete error");
                res.send(err);
                //fire event to let the user know that their message was not deleted. 
            } else {
                res.send('message deleted successfully');

            }
        })
    })

    app.use('/query', router);
}

