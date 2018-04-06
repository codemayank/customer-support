const mongoose = require('mongoose')

let ticketSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true
    },
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
    _creator : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    createdAt : {
        type : Date
    },
    messages : [{
        from : {type:mongoose.Schema.Types.ObjectId},
        to : {type:mongoose.Schema.Types.ObjectId},
        createdAt : Date
    }]
})

module.exports = mongoose.model('Ticket', ticketSchema);