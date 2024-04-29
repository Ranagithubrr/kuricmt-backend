const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quoteSchema = new Schema({
   name:{
    type:String,
    required:true
   },
   department:{
    type:String,
    default:"computer"
   },
   session:{
    type:String,
    required:true,
   },
   message:{
    type:String,
    required:true
   },
   createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Quote", quoteSchema)