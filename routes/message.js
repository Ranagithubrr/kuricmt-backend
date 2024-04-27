const express = require('express')
const router = express.Router();
const Message = require('../models/messageModel');

router.post('/message', (req, res) => {
    const { content, sender } = req.body;
    const newMessage = new Message({ body:content, from:sender });
    newMessage.save((err, savedMessage) => {
        if (err) return res.status(500).send(err);
        io.emit('message', savedMessage);
        return res.status(201).send(savedMessage);
    });
});