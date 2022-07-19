const mongoose = require('mongoose');

// Category Schema
const CategorySchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        maxLength: 20,
    }

}, {
    timestamps: true
});


module.exports = mongoose.model('Category', CategorySchema);