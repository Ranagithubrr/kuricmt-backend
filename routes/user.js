const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../middleware/jwtmiddleware');

// get all teachers
router.get('/', async (req, res) => {
    const AllUser = await User.find({}, '-password');
    if (AllUser) {
        return res.status(200).send({ msg: "Got Users", AllUser })
    } else {
        return res.status(400).send({ msg: "Failed to retrive Users" })
    }
});
// get inactivate teachers
router.get('/inactive-teacher', async (req, res) => {
    try {
        const allUsers = await User.find({ isactivate: false }, '-password');
        if (allUsers.length > 0) {
            return res.status(200).send({ msg: "Got Users", allUsers });
        } else {
            return res.status(404).send({ msg: "No inactive users found" });
        }
    } catch (error) {
        return res.status(500).send({ msg: "Failed to retrieve users", error: error.message });
    }
})
// get single teacher data
router.get('/:id', async (req, res) => {
    try {
        const teacherId = req.params.id;
        const teacher = await User.findById(teacherId, '-password');
        if (teacher) {
            return res.status(200).send({ msg: "Got Teacher", teacher });
        } else {
            return res.status(404).send({ msg: "Teacher not found" });
        }
    } catch (error) {
        console.error("Error retrieving teacher:", error);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
});

// token
const createToken = (user) => {
    return jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '3d' })
}
// log in user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ msg: "Please provide all creadentials" })
    }
    try {
        const user = await User.findOne({ email });
        if (user) {
            const userData = {
                type: user.type,
                email: user.email,
            };

            const token = createToken(userData);
            const verifypass = await bcrypt.compare(password, user.password);
            if (verifypass) {
                if (user.isactivate === true) {
                    user.password = undefined;
                    return res.status(200).json({ msg: 'log in success', user, token });
                } else {
                    return res.status(406).json({ msg: 'Account is not activated' });
                }
            } else {
                return res.status(404).json({ msg: 'Invalid credentials' });
            }
        } else {
            return res.status(404).json({ msg: 'User not found' });
        }
    } catch (err) {
        return res.status(400).json({ msg: "Server error" });
    }

});
// register user
router.post('/register', async (req, res) => {
    const { email, password, name, title, phone, address, website } = req.body;
    const type = "teacher";
    if (!email | !password) {
        res.status(400).send("Provide Data: email, password, name, title, phone, address, website, type");
        res.end();
        return;
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
        return res.status(200).json({ msg: "User created", Data })
    } else {
        return res.status(400).json({ msg: "Failed to create user" })
    }
});
// register admin
router.post('/register-admin', async (req, res) => {
    const email = "admin@gmail.com";
    const password = "pass123";
    const sault = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, sault)
    const Data = await User.create({ email, password: hash, type: "admin", isactivate: true });
    if (Data) {
        res.status(200).json({ msg: "User created", Data })
    } else {
        res.status(400).json({ msg: "Failed to create user" })
    }
});
// update user profile
router.post('/update-profile', verifyToken, async (req, res) => {
    const {
        email,
        name,
        title,
        phone,
        address,
        website,
        image,
        facebook,
        instagram,
        twitter
    } = req.body;
    const userId = req.body.userId;
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
    if (!userId && !email) {
        return res.status(400).json({ msg: "User id or email not provided" });
    }
    if (req.user && req.user.user && req.user.user.email === email) {
        try {
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
            existingUser.facebook = facebook || existingUser.facebook;
            existingUser.instagram = instagram || existingUser.instagram;
            existingUser.twitter = twitter || existingUser.twitter;
            existingUser.image = image || existingUser.image || "";

            // Save the updated user object
            const updatedUser = await existingUser.save();
            // removing the password before sending 
            updatedUser.password = undefined;
            return res.status(200).json({ msg: 'Profile updated successfully', updatedUser, token });
        } catch (error) {
            console.error('Error updating profile:', error.message);
            return res.status(500).json({ msg: 'Internal server error' });
        }
    } else {
        return res.status(400).json({ msg: "access declined" })
    }
});

// activate teaceher 
router.post('/activate-teacher', verifyToken, async (req, res) => {
    if (req.user && req.user.user && req.user.user.type === "admin") {
        const { teacherId } = req.body;
        if (!teacherId) {
            return res.status(400).json({ msg: "Please provide teacher id" })
        }
        try {
            const updatedTeacher = await User.findByIdAndUpdate(
                teacherId,
                { $set: { isactivate: true } },
                { new: true }
            );
            if (!updatedTeacher) {
                return res.status(404).json({ msg: 'Teacher not found' });
            }
            updatedTeacher.password = undefined;
            res.status(200).json({ msg: 'Teacher status updated to active', updatedTeacher });
        } catch (err) {
            return res.status(404).json({ msg: 'Request Failed' });
        }
    } else {
        return res.status(400).json({ msg: "access declined" })
    }
});
// delete teacher
router.post('/delete-teacher', verifyToken, async (req, res) => {
    if (req.user && req.user.user && req.user.user.type === "admin") {
        const { teacherId } = req.body;
        if (!teacherId) {
            return res.status(400).json({ msg: "Please provide teacher id" })
        }
        try {
            const teacherToDelete = await User.findById(teacherId);
            if (!teacherToDelete) {
                return res.status(404).json({ msg: 'Teacher not found' });
            }
            if (teacherToDelete.type === 'admin') {
                return res.status(403).json({ msg: 'Forbidden: Admin cannot be deleted' });
            }
            const deletedTeacher = await User.findByIdAndDelete(teacherId);
            if (!deletedTeacher) {
                return res.status(404).json({ msg: 'Teacher not found' });
            }
            res.status(200).json({ msg: 'Teacher deleted ', deletedTeacher });
        } catch (err) {
            console.log(err);
            return res.status(404).json({ msg: 'Request Failed' });
        }
    } else {
        res.status(400).json({ msg: "access declined" })
    }
});
module.exports = router;