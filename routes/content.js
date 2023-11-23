const express = require('express')
const router = express.Router();
const Content = require('../models/contentModel');

router.get('/', async (req, res) => {
    try {
        const allData = await Content.find({});
        res.status(200).json(allData);
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.put('/', async (req, res) => {
    const { maintitle, tagline, mainlogo, photos } = req.body;
    const contentObj = {
        maintitle,
        tagline,
        mainlogo,
        photos
    };

    console.log(contentObj);

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
});

module.exports = router;