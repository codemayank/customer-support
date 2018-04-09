const mongoose = require('mongoose')

let ticketSchema = new mongoose.Schema({
    email : {
        type:String,
        required:true
    },
    phoneNumber : {
        type:Number,
        required:true
    },
    qTitle : {
        type:String,
        required:true
    },
    qDescription : {
        type:String,
        required:true
    },
    resolved : {type:Boolean},
    status : {type : String},
    _creator : {
        id : {
            type : mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username : String
    },
    createdAt : {
        type : Date
    },
    messages : [{
        type : mongoose.Schema.Types.ObjectId,
        ref: "Message"
    }]
})

module.exports = mongoose.model('Ticket', ticketSchema);