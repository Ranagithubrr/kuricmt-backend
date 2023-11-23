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
    photos:{
        type:Array,
    },     
});

module.exports = mongoose.model("Content", contentSchema)