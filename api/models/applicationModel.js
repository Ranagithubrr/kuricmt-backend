const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicationSchema = new Schema({    
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    semester: {
        type: String,
        required: true,
    },
    shift: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        default: "computer",
    },
    roll: {
        type: String,
    },
    subject: {
        type: String,
        default: Date.now,
    },
    body: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "pending",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Application", applicationSchema)