const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    isactivate:{
        type:Boolean,
    },
    name:{
        type:String,
    },
    phone:{
        type:String,
    },
    title:{
        type:String,
    },
    address:{
        type:String,
    },
    website:{
        type:String,
    },
    image:{
        type:String,
    },
    birth:{
        day:{
            type:String
        },
        month:{
            type:String
        },
        year:{
            type:String
        },
    },
});

module.exports = mongoose.model("User", userSchema)