const mongoose = require('mongoose');

// Author Schema
const AuthorSchema = mongoose.Schema({
    full_name: {
        type: String,
        required: true,
        maxLength: 60,
    },
    user_id: {
        type: String,
        required: true,
        unique: true,
        maxLength: 10,
    },
    email: {
        type: String,
        required: true,
        maxLength: 60,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profile_pic: {
        type: String,
        default: ""
    },
    is_active: {
        type: Boolean,
        default: true,
    },
    reads: {
        type: Number,
        default: 0
    },
    articles: {
        type: Number,
        default: 0
    },

}, {
    timestamps: true
});


module.exports = mongoose.model('Author', AuthorSchema);