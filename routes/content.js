const express = require('express')
const router = express.Router();
const Content = require('../models/contentModel');

router.get('/', (req, res) => {
    res.send("I'm from content route");
});
router.post('/', async (req, res) => {
    const { maintitle, tagline } = req.body;
    const contentObj = {
        maintitle,
        tagline,        
    }
    console.log(contentObj)
    const Data = await Content.create({
        ...contentObj
    })
    if(Data){
        res.status(200).json({msg:"Data created", Data})
    }else{
        res.status(400).send("Failed")
    }    
});

router.put('/', async (req, res) => {    
    const { maintitle, tagline, mainlogo,photos } = req.body;
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

module.exports = router;