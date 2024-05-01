const express = require('express')
const router = express.Router();
const Quote = require('../models/quoteModel');

// Post a notice
router.post('/', async (req, res) => {
    const { name, department, session, message, status } = req.body;
    if (!name  || !session || !message) {
      return res.status(400).json({ msg: "Fill all the fields" })
    }
    const QuoteObj = {
      name,
      department,
      session,
      message,
      status
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

// delete quote
router.delete('/:id', async (req, res) => {            
        const quoteId = req.params.id;
        try {
            const deletedQuote = await Quote.findOneAndDelete({ _id: quoteId });
            if (deletedQuote) {
                res.status(200).json({ msg: "quote deleted", deletedQuote });
            } else {
                res.status(404).json({ msg: "quote not found" });
            }
        } catch (error) {
            console.error('Error deleting quote:', error);
            res.status(500).json({ msg: "Server error" });
        }
      
});
// update status
router.post('/update-status/:id', async (req, res) => {            
        const quoteId = req.params.id;        
        try {
            const quote = await Quote.findOne({ _id: quoteId });
            if (quote) {                
                quote.status = !quote.status;               
                await quote.save();
                res.status(200).json({ msg: "Quote status updated" }); 
            } else {
                console.error('Quote not found');  
                res.status(500).json({ msg: "Quote not found" });              
            }
        } catch (error) {
            console.error('Error deleting quote:', error);
            res.status(500).json({ msg: "Server error" });
        }      
      
});



module.exports = router;