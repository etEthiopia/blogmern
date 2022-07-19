const mongoose = require('mongoose');

// Ad Schema
const AdSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxLength: 60,
    },
    company: {
        type: String,
        required: true,
        maxLength: 60,
    },
    picture: {
        type: String,
        required: true,
        unique: true
    },
    link: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    is_active: {
        type: Boolean,
        default: true,
    },
    expiry_date: {
        type: Date,
        required: true
    }


}, {
    timestamps: true
});


module.exports = mongoose.model('Ad', AdSchema);