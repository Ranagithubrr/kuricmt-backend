const express = require('express')
const router = express.Router();
const { verifyToken } = require('../middleware/jwtmiddleware');
const Notices = require('../models/noticeModel');

// Post a notice
router.post('/', verifyToken, async (req, res) => {
  if (req.user && req.user.user && req.user.user.type === 'admin') {
    const { title, description, noticeurl } = req.body;
    if (!title || !description || !noticeurl) {
      return res.status(400).json({ msg: "Fill all the fields" })
    }
    const NoticeObj = {
      title,
      description,
      noticeurl
    }
    const Data = await Notices.create({
      ...NoticeObj
    });
    if (Data) {
      return res.status(200).json({ msg: "Notice Uploaded", Data })
    } else {
      return res.status(400).json({ msg: "Failed to Upload" })
    }
  }
  else {
    return res.status(400).json({ msg: "access denied" })
  }
});

// get all notices 
router.get('/', async (req, res) => {
  const allNotices = await Notices.find({}).sort({ _id: -1 });
  if (allNotices) {
    return res.status(200).json({ msg: "Got Notices", allNotices })
  }
  res.status(400).json({ msg: "Cant get" })
});

// get the single notice



module.exports = router;