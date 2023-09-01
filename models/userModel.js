// models/userModel.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: false,
        trim: true,
    },
    lastName: {
        type: String,
        required: false,
        trim: true,
    },
    name: {
        type: String,
        required: false,
    },

    username: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    picture: {
        type: String,
        required: false
    },

    accountId: {
        type: String,
        required: false
    },
    provider: {
        type: String,
        required: false
    },
    recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
},
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User;