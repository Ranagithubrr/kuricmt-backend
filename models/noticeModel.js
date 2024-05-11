const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noticeSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    noticeurl:{
        type:String,
        required:true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
});

module.exports = mongoose.model("Notice", noticeSchema)