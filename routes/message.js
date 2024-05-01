const express = require('express')
const router = express.Router();
const Message = require('../models/messageModel');
const { io } = require('../app');

router.post('/', async (req, res) => {
    try {
        const { from, body } = req.body;

        // Create a new message
        const newMessage = new Message({
            from,
            body
        });

        // Save the message to the database
        await newMessage.save();

        // Emit the new message to all connected clients
        io.emit('newMessage', newMessage);

        res.status(201).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;