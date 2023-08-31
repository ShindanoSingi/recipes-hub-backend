const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
    },
    imageUrl: {
        type: String,
    },
    description: {
        type: String,
    },
    ingredients: {
        type: String,
    },
    instructions: {
        type: String,
    },
    category: {
        type: String,
    },
    likes: {
        type: Number,
        default: 0,
    },
    dislikes: {
        type: Number,
        default: 0,
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
},
{
    timestamps: true,
});