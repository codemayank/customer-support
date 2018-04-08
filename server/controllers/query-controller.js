const express = require('express'),
      router = express.Router(),
      ticket = require('../models/query-model'),
      _ = require('lodash'),
      authenticate = require('../controllers/middlewares/authenticate');

module.exports.controller = (app) => {

    //route to submit a query.
    router.post('/user/submit-query', authenticate, (req, res) =>{
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
            //fire event to send an e-mail to the client that their query has been received by the system and an admin will reply to them soon.
            res.send(newTicket);
        });
    });

    //route to show the queries to the user.
    router.get('/user/show-queries', authenticate, (req, res) => {
        ticket.find({
            _creator : req.user._id
        }).then((tickets)=>{
            res.send({tickets});
        }, (e) =>{
            res.status(400).send(e);
        });
    })

    //route to edit the query
    router.put('/user/edit-query', authenticate, (err, res)=>{
        let body = _.pick(req.body, ['ticket_id', 'qtitle', 'qDescription']);
        ticket.findOneAndUpdate({
            '_creator' : req.user._id,
            '_id' : body.ticket_id
        }, {'qtitle' : body.qtitle, 'qDescription' : body.qDescription}, (err, query)=>{
            if(err){
                res.status(400).send(err)
            }
            res.send(query);
        })
    })

    //route to delete the query
    router.delete('/user/delete-query', authenticate, (err, res) =>{
        ticket.findOneAndRemove({
            '_creator' : req.user._id,
            '_id' : req.body.ticket_id
        }, (err)=>{
            if(err){
                res.status(400).send(err)
            }res.send('The query has been deleted.');
        })
    })

    //route to submit replies to the admins queries
    router.post('/user/submit-reply', authenticate, (req, res)=>{
        let body = _.pick(req.body, ['ticket_id', 'messageBody'])
        body.messageBody.createdAt = new Date().getTime();
        ticket.findOneAndUpdate({
            '_creator' : req.user._id,
            '_id' : req.body.ticket_id
        }, {$push : {'messages' : req.body.message}}, (err, message)=>{
            if(err){
                res.status(400).send(err)
            }
            res.send(message);
        })
    })

    //route to edit the replies submitted to admins queries
    router.put('/user/edit-reply', authenticate, (req, res)=>{
        
    })


    //route to mark the query as resolved from user end.
    router.put('/user/mark-resolved', authenticate, (req, res)=>{
        ticket.findOneAndUpdate({
            '_creator' : req.user._id,
            '_id' : req.body.ticket_id
        }, {'resolved' : true}, (err, message)=>{
            if(err){
                res.status(400).send()
            }
            //send e-mail to the admins that has been corresponding with this guy that the query has been marked as resolved.
            res.send('Your query has been marked as resolved');
        })
    })

    //route to show all the queries to the admins.
    router.get('/admin/show-queries', authenticate, (req, res)=>{
        if(req.user.access = "adminAuth"){
            ticket.find().then((tickets)=>{
                res.send({tickets});
            }, (e)=>{
                res.status(400).send(e)
            });
        }else{
            res.status(401).send()
        }
    })

    //route to submit answers to user queries
    router.put('/admin/submit-answer', authenticate, (req, res)=>{
        if(req.user.access === "adminAuth"){
            let body = _.pick(req.body, ['_id', 'message', 'messageBody']);
            body.message.createdAt = new Date().getTime();
            ticket.findOneAndUpdate({'_id' : body._id}, {$push : {'messages' : body.message}}, (err, message) =>{
                if(err){
                    res.status(400).send()
                }
                res.send('message submitted successfully');
                //fire event to send e-mail to the user that an admin has replied to his query.
            })
        }
        res.status(401).send()
    });

    //route to mark the qury as closed by the admin.
    router.put('/admin/close-query', authenticate, (req, res)=>{
        if(req.user.access === "adminAuth"){
            ticket.findOneAndUpdate({'_id' : req.body._id, 'resolved' : true}, {'status' : 'Closed'}, (err, ticket)=>{
                if(err){
                    res.status(400).send(err);
                }
                res.send('This query has now been closed and will now be archived.');
                //fire event to send e-mail to the user that the admin has market their query as closed.
            })
        }
        res.status(401).send()
    })

    app.use('/query',router);
}