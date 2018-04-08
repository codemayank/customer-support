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
    status : {type : String},
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
        messageBody : {type:String, required : true},
        createdAt : Date
    }]
})

module.exports = mongoose.model('Ticket', ticketSchema);