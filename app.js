const express = require('express')
const app = express();
require('dotenv').config();
const DB = require('mongoose');
const bodyParser = require('body-parser');


app.use(bodyParser.json());

userRoute = require('./routes/user');

app.use('/user', userRoute);

DB.connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`DB connected successfully and backend is running on port ${process.env.PORT}`)
        });
    })
    .catch((err)=>{
        console.log('error connecting to db', err)
    })

