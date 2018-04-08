
const user = require('../../models/user-model');
const ticket = require('../../models/query-model');
const message = require('../../models/message-model');

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

//check ticket owner ship
let checkTicketAccess = (task) =>{
    return (req, res, next) =>{
        authenticate(req, res, ()=>{
            ticket.findById(req.body.ticket_id, (err, foundTicket)=>{
                if(err || !foundTicket){
                    console.log('ticket find error : ticket not found')
                    res.send(err)
                }else{
                    //does the user own the ticket. for delete and edit
                    if(task === 'editTicket'){
                        if(foundTicket._creator.id.equals(req.user._id)){
                            next()
                        }else{
                            console.log('edit/delete ticket not allowed')
                            res.status(401).send()
                        }    
                    }if(task === 'closeTicket'){
                        if(req.user.access === "adminAuth"){
                            next()
                        }else{
                            console.log('close ticket not allowed')
                            res.status(401).send()
                        }                        
                    }if(task === "submitMessage"){
                        if(foundTicket._creator.id.equals(req.user._id) || req.user.access === "adminAuth" ){
                            next()
                        }else{
                            console.log('you are not allowed to submit messages to this ticket')
                            res.status(401).send()
                        }
                    }else{
                        res.status(401).send()
                    }
                }
            })
        })
    }
}

//check message ownership
let checkMessageOwnerShip = () =>{
    return (req, res, next) =>{
        authenticate(req, res, () =>{
            message.findById(req.body.message_id, (err, foundMessage)=>{
                if(err || !foundMessage){
                    console.log('foundmessage error: message not found');
                    res.send(err);
                }else{
                    //does the user own the message.
                    if(foundMessage.from.id.equals(req.user._id)){
                        next()
                    }else{
                        res.status(401).send({message : 'you are not permitted to edit or delete. this message'});
                    }
                }
            })
        })
    }
}

module.exports = {authenticate : authenticate, checkTicketAccess : checkTicketAccess, checkMessageOwnerShip : checkMessageOwnerShip};