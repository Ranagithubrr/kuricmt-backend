const express = require('express')
const router = express.Router();
const Quote = require('../models/quoteModel');

// Post a notice
router.post('/', async (req, res) => {
    const { name, department, session, message } = req.body;
    if (!name  || !session || !message) {
      return res.status(400).json({ msg: "Fill all the fields" })
    }
    const QuoteObj = {
      name,
      department,
      session,
      message
    }
    const Data = await Quote.create({
      ...QuoteObj
    });
    if (Data) {
      return res.status(200).json({ msg: "Quote Uploaded", Data })
    } else {
      return res.status(400).json({ msg: "Failed to Upload" })
    }
  
});

// get all notices 
router.get('/', async (req, res) => {
  const allQuotes = await Quote.find({}).sort({ _id: -1 });
  if (allQuotes) {
    return res.status(200).json({ msg: "Got Quotes", allQuotes })
  }
  res.status(400).json({ msg: "Cant get quote" })
});



module.exports = router;