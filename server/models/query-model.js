const mongoose = require('mongoose')

let ticketSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true
    },
    email : {
        type:String,
        required:true,
        unique : true
    },
    phoneNumber : {
        type:Number,
        required:true,
        unique:true
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
    createdAt : {
        type : Date
    }
})

mongoose.model('Ticket', ticketSchema);