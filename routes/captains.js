const express = require('express')
const router = express.Router();
const Captains = require('../models/captainsModel');


router.get('/', (req, res) => {
    res.send("I am from captains route")
});
router.post('/', (req, res) => {
    const { name, roll, semester, phone, email } = req.body;
    if(name == undefined || roll == undefined || semester == undefined || phone == undefined || email == undefined){
        res.status(400).json({msg:"Please provide all data"});        
    }
    console.log(roll);
    const capobj = {
        name, roll, semester, phone, email
    }
    res.status(200).json({msg:"got data", capobj})
});



module.exports = router;