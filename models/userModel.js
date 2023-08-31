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
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    photo: {
        type: String,
        required: false
    },
    provider: {
        type: String,
        required: false
    },
    recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recfipe' }],
},
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User;