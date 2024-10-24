const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Adjust the path as necessary
const multer=require("multer")
const path=require("path")
const verifyToken=require('../middlewares/auth')
// Get user data by ID
router.get("/", verifyToken,async (req, res) => {
    const decoded_username=req.user 

    try {
        // Find the user by ID
        const user = await User.find({username:decoded_username.username})

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json(user); // Return the user data
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

router.put('/about-me',verifyToken, async (req, res) => {
    const decoded_username = req.user; // Assuming req.user contains decoded token data (middleware should handle this)

    try {
        // Find the user by username (assuming decoded_username.username holds the username)
        const user_data = await User.findOne({ username: decoded_username.username });

        if (!user_data) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Update the "About Me" field
        const updatedUser = await User.findByIdAndUpdate(
            user_data._id,
            { aboutMe: req.body.aboutMe }, // Update "About Me" field from the request body
            { new: true } // Return the updated user object
        );

        if (!updatedUser) {
            return res.status(500).json({ msg: 'Failed to update user data' });
        }

        // Respond with the updated user data
        res.json({
            msg: 'Profile updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../images'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
    }
});

const upload = multer({
    storage: storage,
});

router.put('/profile-pic', verifyToken, upload.single('profilePic'), async (req, res) => {
    const decoded_username = req.user; // Assuming req.user contains the decoded token

    try {
        const user = await User.findOne({ username: decoded_username.username });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Update profile picture field with the file path
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { profilePic: `/images/${req.file.filename}` }, // Save file path to database
            { new: true }
        );

        res.json({
            msg: 'Profile picture updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        res.status(500).json({ msg: 'Error updating profile picture' });
    }
});

module.exports=router

