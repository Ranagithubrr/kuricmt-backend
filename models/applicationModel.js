const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
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