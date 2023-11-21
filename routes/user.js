const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    res.send("from router")
});
// token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' })
}
// log in user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        const token = createToken()
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
        isactivate:false,
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

// router.post('/regiser-admin', async (req, res) => {
//     const email = "admin@gmail.com";
//     const password = "pass123";
//     const sault = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(password, sault)
//     const Data = await User.create({ email, password: hash, type:"admin" });
//     if (Data) {
//         res.status(200).json({ msg: "User created", Data })
//     } else {
//         res.status(400).json({ msg: "Failed to create user" })
//     }
// });
module.exports = router;