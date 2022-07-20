const mongoose = require('mongoose');

// Article Schema
const ArticleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxLength: 50,
    },
    category: {
        type: String,
        required: true,
        maxLength: 20,
    },
    content: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        default: ""
    },
    author_user_id: {
        type: String,
        required: true,
        maxLength: 10,
    },
    author_full_name: {
        type: String,
        required: true,
        maxLength: 60,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        maxLength: 30,
    },
    is_visible: {
        type: Boolean,
        default: true
    },
    is_approved: {
        type: Boolean,
        default: true
    },
    is_draft: {
        type: Boolean,
        default: false
    },
    is_edited: {
        type: Boolean,
        default: false
    },

}, {
    timestamps: true
});


module.exports = mongoose.model('Article', ArticleSchema);