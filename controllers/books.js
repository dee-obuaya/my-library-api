const Book = require('../models/book');
const ExpressError = require('../utils/ExpressError');

module.exports.index = async (req, res) => {
    const genre = req.query.genre;
    if (genre) {
        const booksByGenre = await Book.find({ genre: { $in: [genre] } });
        if (booksByGenre.length > 0) {
            return res.status(200).json({
                status: 'success',
                books: booksByGenre,
            });
        }
    }
    const allBooks = await Book.find({});
    res.status(200).json({
        status: 'success',
        books: allBooks,
    });
}

module.exports.addBook = async (req, res) => {
    // "book": {
    //     "title": "Rockstar",
    //     "author": "Jackie Collins",
    //     "genre": ["Drama", "Fame"]
    // }

    const book = new Book(req.body.book);
    await book.save();

    res.status(200).json({
        book: book
    });
}

module.exports.updateBook = async (req, res) => {
    const { id } = req.params;
    const book = await Book.findByIdAndUpdate(id, { ...req.body.book });
    res.status(200).json({
        updatedBook: book
    });
}

module.exports.deleteBook = async (req, res) => {
    const { id } = req.params;
    const book = await Book.findByIdAndDelete(id);
    res.status(200).json({
        message: `Deleted ${book.title}`,
    });
}

module.exports.getBook = async (req, res) => {
    const book = await Book.findOne({ title: req.params.title });
    if (!book) {
        const err = new ExpressError('Book not found', 404);
        return res.status(err.statusCode).json({ err });
    }
    res.status(200).json({
        message: 'success',
        book
    });
}
