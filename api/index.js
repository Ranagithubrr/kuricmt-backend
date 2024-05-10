const express = require('express');
const app = express();
require('dotenv').config();
const DB = require('mongoose');
const cors = require('cors');
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*"
    }
});

const bodyParser = require('body-parser');
const Message = require('./models/messageModel');

app.use(cors({
    origin: '*'
}));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

userRoute = require('./routes/user');
contentRoute = require('./routes/content');
captaintRoute = require('./routes/captains');
noticeRoute = require('./routes/notice');
applicationRoute = require('./routes/application');
quoteRoute = require('./routes/quotes')



app.use('/user', userRoute);
app.use('/content', contentRoute);
app.use('/captains', captaintRoute);
app.use('/notice', noticeRoute);
app.use('/application', applicationRoute);
app.use('/quotes', quoteRoute);

app.get('/', (req,res)=>{
    console.log('backend is running');
    res.status(200).json({msg:"server running"})
})

const fetchOldMessages = async () => {
    try {
        // Fetch old messages from the database
        const oldMessages = await Message.find().lean(); // Assuming Message is your Mongoose model
        return oldMessages;
    } catch (error) {
        console.error('Error fetching old messages:', error);
        return [];
    }
};

io.on('connection', async (socket) => {
    console.log('A client connected');

    try {
        // Fetch old messages on connection
        const oldMessages = await fetchOldMessages();
        socket.emit('pastMessages', oldMessages); // Emit past messages to the new client
    } catch (error) {
        console.error('Error sending past messages:', error);
    }

    // Listen for new messages from clients
    socket.on('newMessage', async (newMessage) => {
        try {
            // Save the new message to the database
            const savedMessage = await new Message(newMessage).save();

            // Emit the new message to all connected clients
            io.emit('newMessage', savedMessage);
        } catch (error) {
            console.error('Error saving new message:', error);
        }
    });

    // Handle client disconnection
    socket.on('disconnect', () => {
        console.log('A client disconnected');
    });
});


// Your other routes and middleware...

module.exports = {
    app,
    io
};

// starting the server after DB connected
DB.connect(process.env.MONGO_URL)
    .then(() => {
        http.listen(process.env.PORT, () => {
            console.log(`Connection Successfull and running on port ${process.env.PORT}`)
        });
    })
    .catch((err) => {
        console.log('error connecting to db', err)
    });
