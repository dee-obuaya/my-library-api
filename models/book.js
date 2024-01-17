const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    title: String,
    author: String,
    genre: [String],
    rating: {
        type: Number,
        max: 5,
        min: 1,
    }
});

module.exports = mongoose.model('Book', BookSchema);
