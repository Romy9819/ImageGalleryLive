const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const User = require('../models/user_model')
const secret_key = 'iuuuufytdyfjgufuf';

router.post('/register', async (req, res) => {
    try {
        const {username, email, password} = req.body;

        const existingUser = await User.findOne({email});

        if (existingUser) return res.status(409).json({message: "User with this email already exists"});

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({username, email, password: hashedPassword})
        await newUser.save();

        res.status(201).json({message: "User registered successfully"})
    } catch {
        res.status(500).json({message: "Internal Server Error"});
    }
})

router.post('/login', async (req, res) => {
    try {

        console.log("hi")
        const {email, password} = req.body;

        const user = await User.findOne({email});

        if (!user) return res.status(404).json({message: "User not found"})

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) return res.status(401).json({message: "Wrong Password"})

        // const token = jwt.sign({userId: user._id}, secret_key, {expiresIn: '1h'})

        res.json({message: "Login successfull"})
    } catch (error) {
        console.error("Login error:", error); // Log the error for debugging purposes
        res.status(500).json({ message: "Internal Server Error" });
    }
})

module.exports = router;

