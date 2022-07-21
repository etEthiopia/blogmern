const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

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
    reads: {
        type: Number,
        default: 0
    },
    current_read: {
        type: Number,
        default: 0
    },
    previous_read_on: {
        type: Number,
        default: Date.now
    },
    current_read_on: {
        type: Number,
        default: Date.now
    },
    trending: {
        type: Number,
        default: 0
    }

}, {
    timestamps: true
});

ArticleSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Article', ArticleSchema);