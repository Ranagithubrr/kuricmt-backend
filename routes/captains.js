const express = require('express')
const router = express.Router();
const Captains = require('../models/captainsModel');

// get all captains
router.get('/', async (req, res) => {
    const AllCaptains = await Captains.find({});
    if (AllCaptains) {
        res.status(200).json({ msg: "Got Data", AllCaptains })
    } else {
        res.status(400).json({ msg: "Failed to retrive data" })
    }
});
// add captain
router.post('/', async (req, res) => {
    const { name, roll, semester, phone, email } = req.body;
    if (name === undefined || roll === undefined || semester === undefined || phone === undefined || email === undefined) {
        return res.status(400).json({ msg: "Please provide all data" });
    }
    const capobj = {
        name, roll, semester, phone, email
    }
    const existingCaptain = await Captains.findOne({ roll });
    if (existingCaptain) {
        return res.status(400).json({ msg: "Captain with this roll already exists" });
    }
    try {
        const Data = await Captains.create({
            ...capobj
        });

        if (Data) {
            return res.status(200).json({ msg: "Captain Added", Data });
        } else {
            return res.status(400).json({ msg: "Failed to Add Captain" });
        }
    } catch (err) {
        console.error('Error creating captain:', err);
        return res.status(500).json({ msg: "Server error" });
    }
});

// delete captain
router.post('/delete/:id', async (req, res) => {
    const captainId = req.params.id;
    try {
        const deletedCaptain = await Captains.findOneAndDelete({ _id: captainId });
        if (deletedCaptain) {
            res.status(200).json({ msg: "Captain deleted", deletedCaptain });
        } else {
            res.status(404).json({ msg: "Captain not found" });
        }
    } catch (error) {
        console.error('Error deleting captain:', error);
        res.status(500).json({ msg: "Server error" });
    }
});

// update captain
router.post('/update/:id', async (req, res) => {
    const captainId = req.params.id;
    const { name, roll, semester, phone, email } = req.body;

    // Check if any required data is missing
    if (name === undefined || roll === undefined || semester === undefined || phone === undefined || email === undefined) {
        return res.status(400).json({ msg: "Please provide all data" });
    }
    const existingCaptain = await Captains.findById(captainId);

    if (!existingCaptain) {
        return res.status(404).json({ msg: "Captain not found" });
    }

    const updatedCaptainData = {
        name: name || existingCaptain.name,
        roll: roll || existingCaptain.roll,
        semester: semester || existingCaptain.semester,
        phone: phone || existingCaptain.phone,
        email: email || existingCaptain.email
    };

    try {
        const updatedCaptain = await Captains.findOneAndUpdate(
            { _id: captainId },
            { $set: updatedCaptainData },
            { new: true }
        );

        if (updatedCaptain) {
            res.status(200).json({ msg: "Captain updated", updatedCaptain });
        } else {
            res.status(404).json({ msg: "Captain not found" });
        }
    } catch (error) {
        console.error('Error updating captain:', error);
        res.status(500).json({ msg: "Server error" });
    }
});





module.exports = router;