const express = require('express')
const app = express();
require('dotenv').config();
const DB = require('mongoose');
const bodyParser = require('body-parser');


app.use(bodyParser.json());

userRoute = require('./routes/user');
contentRoute = require('./routes/content');

app.use('/user', userRoute);
app.use('/content', contentRoute);
// starting the server after DB connected
DB.connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Connection Successfull and running on port ${process.env.PORT}`)
        });
    })
    .catch((err)=>{
        console.log('error connecting to db', err)
    })

