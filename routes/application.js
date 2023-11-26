const express = require('express')
const router = express.Router();
const Applications = require('../models/applicationModel');
const { verifyToken } = require('../middleware/jwtmiddleware');

// create application
router.post('/', async (req, res) => {
    const { title, name, roll, subject, body } = req.body;
    const appliObj = {
        title,
        name,
        roll,
        subject,
        body
    }
    if (!title || !name || !roll || !subject) {
        return res.status(400).json({ msg: "Plese provide all data" })
    }
    try{
        const Data = await Applications.create({
            ...appliObj
        });
        if(Data){
           return res.status(200).json({msg:"Application uploaded", Data})
        }
        return res.status(400).json({msg:"Failed to upload Application"})
    }catch(err){
        console.log(err);
        res.status(400).json({msg:"Error operation"})
    }

});
// resolve application
router.post('/resolve-application', verifyToken, async (req, res) => {
    if (req.user && req.user.user && req.user.user.type === "admin") {
        const { applicationId } = req.body;
        if (!applicationId) {
            return res.status(400).json({ msg: "Please provide Application id" })
        }
        try {
            const updatedApplication = await Applications.findByIdAndUpdate(
                applicationId,
                { $set: { status: "resolved" } },
                { new: true }
            );
            if (!updatedApplication) {
                return res.status(404).json({ msg: 'Application not found' });
            }
            res.status(200).json({ msg: 'Application status updated to resolved', updatedApplication });
        } catch (err) {
            return res.status(404).json({ msg: 'Request Failed' });
        }
    } else {
        res.status(400).json({ msg: "access declined" })
    }
});
// get all application
router.get('/', async (req,res)=>{
    const ApplicationsData = await Applications.find({});
    if(Applications){
        return res.status(200).json({msg:"Applications", ApplicationsData})
    }
    res.status(400).json({msg:"Failed"})
})

module.exports = router;