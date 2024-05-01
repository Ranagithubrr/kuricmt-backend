const express = require('express')
const router = express.Router();
const Content = require('../models/contentModel');
const Notices = require('../models/noticeModel');
const User = require('../models/userModel');
const Quote = require('../models/quoteModel');
const { verifyToken } = require('../middleware/jwtmiddleware');

// get all contents
router.get('/', async (req, res) => {
    try {
        const allData = await Content.find({});
        res.status(200).json(allData);
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).send('Internal Server Error');
    }
});

// update contents only by admin
router.put('/', verifyToken, async (req, res) => {
    if (req.user && req.user.user && req.user.user.type === 'admin') {
        const {
            maintitle,
            tagline,
            mainlogo,
            coverphoto,
            photos,
            labassistant,
            labonecomputer,
            laboneseat,
            labtwocomputer,
            labtwoseat,
            hlabcomputer,
            hlabseat
        } = req.body;
        const contentObj = {
            maintitle,
            tagline,
            mainlogo,
            coverphoto,
            photos,
            labassistant,
            labonecomputer,
            laboneseat,
            labtwocomputer,
            labtwoseat,
            hlabcomputer,
            hlabseat
        };
        try {
            const updatedData = await Content.findOneAndUpdate(
                {},
                { $set: contentObj },
                { new: true }
            );

            if (updatedData) {
                res.status(200).json({ msg: 'Data updated', updatedData });
            } else {
                res.status(404).json({ error: 'Data not found' });
            }
        } catch (error) {
            console.error('Error updating data:', error);
            res.status(500).send('Internal Server Error');
        }
    } else {
        return res.status(400).json({ msg: "access denied" })
    }
});

// get all contents
router.get('/website-data', async (req, res) => {
    try {
        const contents = await Content.find({});
        const notices = await Notices.find({});
        const teachers = await User.find({}, '-password');
        const Quotes = await Quote.find({});
        res.status(200).json({ contents, notices, teachers, Quotes });
        res.status(200).json();
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;