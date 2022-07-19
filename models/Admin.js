const mongoose = require('mongoose');

// Admin Schema
const AdminSchema = mongoose.Schema({
    full_name: {
        type: String,
        required: true,
        maxLength: 60,
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


}, {
    timestamps: true
});


module.exports = mongoose.model('Admin', AdminSchema);