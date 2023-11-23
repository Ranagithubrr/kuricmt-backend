const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const captainSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    roll:{
        type:String,
        required:true,
    },
    semester:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
});

module.exports = mongoose.model("Captain", captainSchema)