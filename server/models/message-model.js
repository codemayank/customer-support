const mongoose = require('mongoose');

let messageSchema = new mongoose.Schema({
    text : {type:String},
    from:{
        id : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    username : String
    }
})

module.exports = mongoose.model('Message', messageSchema);