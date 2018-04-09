const express = require('express'),
      router = express.Router(),
      ticket = require('../models/query-model'),
      message = require('../models/message-model')
      _ = require('lodash'),
      authenticate = require('../controllers/middlewares/authenticate');

module.exports.controller = (app) => {

    //route to submit a query.
    router.post('/user/submit-query', authenticate, (req, res) =>{
        let newTicket = new ticket({
            email : req.user.email,
            phoneNumber : req.user.phoneNumber,
            qTitle : req.body.qTitle,
            qDescription : req.body.qDescription,
            resolved : false,
            status : "open",
            createdAt : new Date().getTime(),
            _creator : {
                id : req.user._id,
                username : req.user.username

            }
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
        console.log(req.user._id);
        ticket.find({
            '_creator.id' : req.user._id
        }).then((tickets)=>{
            res.send({tickets});
        }, (e) =>{
            res.status(400).send(e);
        });
    });

    //route to edit the query
    router.put('/user/edit-query', authenticate, (req, res)=>{
        let body = _.pick(req.body, ['ticket_id', 'qTitle', 'qDescription']);
        ticket.findOneAndUpdate({
            '_creator.id' : req.user._id,
            '_id' : body.ticket_id
        }, {'qTitle' : body.qTitle, 'qDescription' : body.qDescription}, {new : true}, (err, query)=>{
            if(err){
                console.log('error in saving the edited query.')
                res.status(400).send(err)
            }
            console.log('sending edited query.');
            console.log(query);
            res.send(query);
        })
    })

    //route to delete the query
    router.delete('/user/delete-query', authenticate, (req, res) =>{
        ticket.findOneAndRemove({
            '_creator.id' : req.user._id,
            '_id' : req.body.ticket_id
        }, (err)=>{
            if(err){
                res.status(400).send(err);
            }res.send('The query has been deleted.');
        })
    })

    //route to mark the query as resolved from user end.
    router.put('/user/mark-resolved', authenticate, (req, res)=>{
        ticket.findOneAndUpdate({
            '_creator.id' : req.user._id,
            '_id' : req.body.ticket_id
        }, {'resolved' : true},{new :true} ,(err, query)=>{
            if(err){
                res.status(400).send('unable to resolve query.')
            }if(!query){
                res.send('could not resolve query as you do not own this.')
            }else{
                res.send('Your query has been marked as resolved');
            }
            //send e-mail to the admins that has been corresponding with this guy that the query has been marked as resolved.
            
        })
    })

    //route to show all the queries to the admins.
    router.get('/admin/show-queries', authenticate, (req, res)=>{
        console.log("req user==>",req.token);
        if(req.user.access === "adminAuth"){
            ticket.find().then((tickets)=>{
                res.send({tickets});
            }, (e)=>{
                res.status(400).send(e)
            });
        }else{
            res.status(401).send()
        }
    })

    //route to mark the qury as closed by the admin.
    router.put('/admin/close-query', authenticate, (req, res)=>{
        if(req.user.access === "adminAuth"){
            ticket.findOneAndUpdate({'_id' : req.body._id, 'resolved' : true}, {'status' : 'Closed'}, (err, ticket)=>{
                if(err){
                    res.status(400).send(err);
                }
                res.send('This query has now been closed and will now be archived.');
            })
        }
        res.status(401).send()
    })

    app.use('/query',router);
}