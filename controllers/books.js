const Book = require('../models/book');
const ExpressError = require('../utils/ExpressError');

module.exports.index = async (req, res) => {
    const { genre, author, rating } = req.query;
    if (genre && author) {
        const booksByAuthorInGenre = await Book.find({
            genre: { $in: [genre] },
            author: author
        });
        if (booksByAuthorInGenre.length > 0) {
            return res.status(200).json({
                message: 'success',
                totalBooks: booksByAuthorInGenre.length,
                books: booksByAuthorInGenre,
            });
        } else {
            const err = new ExpressError(`Sorry we could not find any books by ${author} in ${genre}`, 404);
            return res.status(err.statusCode).json({ err });
        }
    } else if (genre && rating) {
        const ratingVal = parseInt(rating);
        const booksRatedInGenre = await Book.find({
            genre: { $in: [genre] },
            rating: { $gte: ratingVal, $lt: ratingVal + 1 }
        });
        if (booksRatedInGenre.length > 0) {
            return res.status(200).json({
                message: 'success',
                totalBooks: booksRatedInGenre.length,
                books: booksRatedInGenre,
            });
        } else {
            const err = new ExpressError(`Sorry we could not find any books rated ${ratingVal} in ${genre}`, 404);
            return res.status(err.statusCode).json({ err });
        }
    } else if (genre) {
        const booksByGenre = await Book.find({
            genre: { $in: [genre] }
        });
        if (booksByGenre.length > 0) {
            return res.status(200).json({
                message: 'success',
                totalBooks: booksByGenre.length,
                books: booksByGenre,
            });
        } else {
            const err = new ExpressError(`Sorry we could not find any books in ${genre}`, 404);
            return res.status(err.statusCode).json({ err });
        }
    } else if (author) {
        const booksByAuthor = await Book.find({
            author: author
        });
        if (booksByAuthor.length > 0) {
            return res.status(200).json({
                message: 'success',
                totalBooks: booksByAuthor.length,
                books: booksByAuthor,
            });
        } else {
            const err = new ExpressError(`Sorry we could not find any books by ${author}`, 404);
            return res.status(err.statusCode).json({ err });
        }
    } else if (rating) {
        const ratingVal = parseInt(rating);
        const booksRated = await Book.find({
            rating: { $gte: ratingVal, $lt: ratingVal + 1 }
        });
        if (booksRated.length > 0) {
            return res.status(200).json({
                message: 'success',
                totalBooks: booksRated.length,
                books: booksRated,
            });
        } else {
            const err = new ExpressError(`Sorry we could not find any books rated in the range of ${ratingVal}`, 404);
            return res.status(err.statusCode).json({ err });
        }
    } else {
        const allBooks = await Book.find({});
        res.status(200).json({
            message: 'success',
            totalBooks: allBooks.length,
            books: allBooks,
        });
    }
}

module.exports.addBook = async (req, res) => {
    const book = new Book(req.body.book);
    await book.save();

    res.status(200).json({
        message: 'success',
        book: book
    });
}

module.exports.updateBook = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const book = await Book.findByIdAndUpdate(id, { ...req.body.book }, { new: true });
    res.status(200).json({
        message: 'success',
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

module.exports.getBooksInGenre = async (req, res) => {
    
}
