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

router.put('/announcement', verifyToken, async (req, res) => {
    if (req.user && req.user.user && req.user.user.type === 'admin') {
        try {
            const filter = {}; // Empty filter to match all documents
            const update = { announcement: req.body.announcement }; // Update object with the new value for the "announcement" field
            const options = { new: true, upsert: true }; // Options to return the modified document and create the document if it doesn't exist

            const updatedAnnouncement = await Content.findOneAndUpdate(filter, update, options);

            if (!updatedAnnouncement) {
                return res.status(404).json({ success: false, message: 'Announcement content not found' });
            }

            return res.status(200).json({ success: true, message: 'Announcement content updated successfully', data: updatedAnnouncement });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    } else {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
});
router.get('/announcement', async (req, res) => {
    try {
        const announcementContent = await Content.findOne({}, { announcement: 1 });
        const announcementStatus = await Content.findOne({}, { announcementstatus: 1 });
        return res.status(200).json({ data: announcementContent, announcementStatus });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }

});
router.post('/status', async (req, res) => {
    try {
        const currentStatus = await Content.findOne({}, { announcementstatus: 1 });

        if (!currentStatus) {
            return res.status(404).json({ success: false, message: 'Announcement status not found' });
        }
        const newStatus = !currentStatus.announcementstatus;
        const updatedStatus = await Content.findOneAndUpdate({}, { announcementstatus: newStatus }, { new: true });

        return res.status(200).json({data: updatedStatus.announcementstatus });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
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