const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    uid:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        default:""
    },
    body:{
        type:String,
        required:true,
    },  
    createdAt: {
        type: Date,
        default: Date.now,
      },
});

module.exports = mongoose.model("Message", messageSchema)