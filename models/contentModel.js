const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contentSchema = new Schema({
    maintitle:{
        type:String,        
    },
    tagline:{
        type:String,      
    },
    mainlogo:{
        type:String,      
    },
    coverphoto:{
        type:String,      
    },
    photos:{
        type:Array,
    },
    labassistant:{
        type:String,
    },   
    labonecomputer:{
        type:String,
    },     
    laboneseat:{
        type:String,
    },     
    labtwocomputer:{
        type:String,
    },     
    labtwoseat:{
        type:String,
    },     
    hlabcomputer:{
        type:String,
    },     
    hlabseat:{
        type:String,
    },     
    announcementstatus:{
        type:Boolean,
        default:false
    },
    announcement:{
        type:String,    
    }
});

module.exports = mongoose.model("Content", contentSchema)