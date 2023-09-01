const User = require('../models/userModel');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');
const cloudinary = require('../cloudinary');

// Register a new user
router.post('/register', async (req, res) => {
    try {
        // Check if user already exists
        const user = await User.findOne({
            username: req.body.username
         });

        if(user) {
            return res.send({
                message: 'User already exists',
                success: false
             });
        }

        // Create a new user
        const hashedPassowrd = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassowrd;
        const newUser = new User(req.body);
        await newUser.save();
        return res.send({
            message: 'User created successfully',
            success: true
        });

    }catch(error) {
        return res.send({
            message: error.message,
            success: false
        });
    }
});

// Login a user
router.post('/login', async (req, res) => {
    try{
        // Check if user already exists
        const user = await User.findOne({
            $or: [{ email: req.body.email }, { username: req.body.username }]
        });

        if(!user) {
            return res.send({
                message: 'Invalid email or username',
                success: false
            });
        }

        // Check if password is correct
        const validPassword = await bcrypt.compare(req.body.password, userEmail.password);
        if(!validPassword) {
            return res.send({
                message: 'Invalid password',
                success: false
            });
        }

        // Create and assign a token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.send({
            message: 'User Logged in successful',
            success: true,
        });

    }catch(error) {
        return res.send({
            message: error.message,
            success: false
        });
    }
});

// Get a user
router.get('/get-current-user', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id });
        if(!user) {
            return res.send({
                message: 'User not found',
                success: false
            });
        }

        return res.send({
            message: 'User fetched successfully!',
            success: true,
        });

    }catch(error) {
        return res.send({
            message: error.message,
            success: false
        });
    }
});

// Update a user
router.put('/update-user', authMiddleware, async (req, res) => {
    try{
        const user = await User.findOne({ _id: req.user._id });
        if(!user) {
            return res.send({
                message: 'User not found',
                success: false
            });
        }

        const updatedUser = await User.findOneAndUpdate({ _id: req.user._id }, req.body, { new: true });

        return res.send({
            message: 'User updated successfully!',
            success: true,
        });

    }catch(error) {
        return res.send({
            message: error.message,
            success: false
        });
    }
});

// Delete a user
router.delete('/delete-user', authMiddleware, async (req, res) => {
    try{
        const user = await User.findOne({ _id: req.user._id });
        if(!user) {
            return res.send({
                message: 'User not found',
                success: false
            });
        }

        const deletedUser = await User.findOneAndDelete({ _id: req.user._id });

        return res.send({
            message: 'User deleted successfully!',
            success: true,
        });
    }catch(error) {
        return res.send({
            message: error.message,
            success: false
        });
    }
});

// Get all users
router.get('/get-all-users', authMiddleware, async (req, res) => {
    try {
        const users = await User.find();
        if(!users) {
            return res.send({
                message: 'Users not found',
                success: false
            });
        }

        return res.send({
            message: 'Users fetched successfully!',
            success: true,
            data: users
        });

    }catch(error) {
        return res.send({
            message: error.message,
            success: false
        });
    }
});

module.exports = router;