const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

router.get('/', async (req, res) => {
    const AllUser = await User.find({});
    if(AllUser){
        return res.status(200).send({msg:"Got Users", AllUser})
    }else{
        return res.status(400).send({msg:"Failed to retrive Users"})
    }


});
// token
const createToken = (user) => {
    return jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '3d' })
}
// log in user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const userData = {
        name: user.name,
        type: user.type,
        email: user.email,
    }
    if (user) {
        const token = createToken(userData)
        const verifypass = await bcrypt.compare(password, user.password);
        if (verifypass) {
            res.status(200).json({ msg: 'log in success', user, token })
        } else {
            res.status(404).json({ msg: 'invalid credentials' })
        }
    } else {
        res.status(404).json({ msg: 'not found' })
    }
});
router.post('/register', async (req, res) => {
    const { email, password, name, title, phone, address, website, type } = req.body;
    if (!email | !password) {
        res.status(400).send("Provide Data");
        res.end();
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ msg: "User with this email already exists" });
    }
    const sault = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, sault)
    const userObj = {
        email,
        password: hash,
        isactivate: false,
        name,
        type,
        title,
        phone,
        address,
        website,
    }

    const Data = await User.create({
        ...userObj
    });
    if (Data) {
        res.status(200).json({ msg: "User created", Data })
    } else {
        res.status(400).json({ msg: "Failed to create user" })
    }
});

router.post('/update-profile', async (req, res) => {
    try {
      const {               
        name,
        title,
        phone,
        address,
        website,        
      } = req.body;     
      const userId = req.body.userId;
  
      // Check if the user exists
      const existingUser = await User.findById(userId);
  
      if (!existingUser) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      // Update user data    
      existingUser.name = name || existingUser.name;
      existingUser.title = title || existingUser.title;
      existingUser.phone = phone || existingUser.phone;
      existingUser.address = address || existingUser.address;
      existingUser.website = website || existingUser.website;
  
      // Save the updated user object
      const updatedUser = await existingUser.save();
  
      res.status(200).json({ msg: 'Profile updated successfully', updatedUser });
    } catch (error) {
      console.error('Error updating profile:', error.message);
      res.status(500).json({ msg: 'Internal server error' });
    }
  });
module.exports = router;