const router = require('express').Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register
router.post('/register', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);

        // Check if username and email already exist
        const isUsername = await User.findOne({ username: req.body.username });
        const isEmail = await User.findOne({ email: req.body.email });

        console.log("Username exists:", isUsername);
        console.log("Email exists:", isEmail);

        // If username and email do not exist, create the user
        if (!isUsername && !isEmail) {
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            const newUser = await User.create({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword
            });
            res.json({ msg: "Register successful"});
        } else {
            res.json({ msg: "Username or email already exists" });
        }

    } catch (error) {
        res.json({ msg: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user exists with the given username
        const user = await User.findOne({ username: username });

        if (user) { // user exists
   
            const isPasswordMatch = await bcrypt.compare(password, user.password);

            if (isPasswordMatch) { // password matches
                // Generate JWT token
                const token = jwt.sign(
                    { id: user._id, username: user.username }, 
                    process.env.jwt_secret, 
                    { expiresIn: '1h' } 
                );

                // Send token to the user
                res.json({ msg: "Login successful", token: token });
            } else {
                res.json({ msg: "Incorrect password" });
            }
        } else {
            res.json({ msg: "User does not exist with this username" });
        }
    } catch (error) {
        res.json({ msg: error.message });
    }
});

module.exports = router;
