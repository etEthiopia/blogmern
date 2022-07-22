const mongoose = require('mongoose');

// Comment Schema
const CommentSchema = mongoose.Schema({
    body: {
        type: String,
        required: true,
        maxLength: 1000,
    },
    author_user_id: {
        type: String,
        required: true,
        maxLength: 10,
    },
    article_id: {
        type: String,
        required: true,
    }

}, {
    timestamps: true
});


module.exports = mongoose.model('Comment', CommentSchema);