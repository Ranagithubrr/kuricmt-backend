const express = require('express')
const router = express.Router();
const Content = require('../models/contentModel');
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

module.exports = router;