const express = require('express')
const router = express.Router();
const Captains = require('../models/captainsModel');


router.get('/', (req, res) => {
    res.send("I am from captains route")
});
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




module.exports = router;