const express = require('express')
const router = express.Router();
const { verifyToken } = require('../middleware/jwtmiddleware');
const multer = require('multer');
const path = require('path');
const Notices = require('../models/noticeModel');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage });

// Post a notice
router.post('/', upload.single('file'), async (req, res) => {
    const { title, description } = req.body;
    console.log(title, description)
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const filename = req.file.filename;
    const noticeObj = {
        title,
        description,
        filename,
    };
    try {
        const Data = await Notices.create({
            ...noticeObj
        });
        if (Data) {
            return res.status(200).json({ msg: "Notice Added", Data });
        } else {
            return res.status(400).json({ msg: "Failed to Add Notice" });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ msg: "Failed to Add Notice" });
    }

});

// get all notices 
router.get('/', async (req,res)=>{
    const AllNotices = await Notices.find({});
    if(AllNotices){
       return res.status(200).json({msg:"Got Notices", AllNotices})
    }
    res.status(400).json({msg:"Cant get"})
});



router.get('/:id', async (req, res) => {
    try {
      const noticeId = req.params.id;
      const notice = await Notices.findById(noticeId);
  
      if (!notice) {
        return res.status(404).json({ msg: 'Notice not found' });
      }
  
      const { title, description, filename, createdAt } = notice;
      const fileContent = await readFileFromDisk(filename);
  
      res.setHeader('Content-Type', 'application/pdf'); // Set the content type to PDF
      res.setHeader('Content-Disposition', `inline; filename=${filename}`); // Specify how the file should be displayed (inline or as an attachment)
      res.send(fileContent);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: 'Internal Server Error' });
    }
  });
  
  // Function to read file content from disk based on filename
  async function readFileFromDisk(filename) {
    const fs = require('fs').promises;
    const path = require('path');
    
    const filePath = path.join(__dirname, '../uploads', filename);
  
    try {
      const fileContent = await fs.readFile(filePath);
      return fileContent;
    } catch (error) {
      console.error(`Error reading file ${filename}:`, error);
      throw new Error(`Error reading file ${filename}`);
    }
  }



module.exports = router;