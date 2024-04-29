const express = require('express')
const app = express();
require('dotenv').config();
const DB = require('mongoose');
const cors = require('cors');

const bodyParser = require('body-parser');


app.use(cors());
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

