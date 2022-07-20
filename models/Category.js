const mongoose = require('mongoose');

// Category Schema
const CategorySchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        maxLength: 20,
    },
    is_active: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});


module.exports = mongoose.model('Category', CategorySchema);