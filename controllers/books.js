const Book = require('../models/book');
const ExpressError = require('../utils/ExpressError');

module.exports.getAllBooks = async (req, res) => {
    const pageLimit = 8;
    let { rating, page = 1 } = req.query;
    if (isNaN(page) || page < 1) {
        page = 1;
    }
    const skip = (page - 1) * pageLimit;

    if (rating && !isNaN(rating) && !(rating > 5) && !(rating < 1)) {
        const ratingVal = parseInt(rating);
        let result = await Book.aggregate([
            { $match: { rating: { $gte: ratingVal, $lt: ratingVal + 1 } } },
            {
                $facet: { //facet runs these operation sin parallel (at the same time)
                    metaData: [
                        { $count: 'totalBooks' },
                        {
                            $addFields: {
                                currentPage: page,
                                totalPages: { $ceil: { $divide: ['$totalBooks', pageLimit] } },
                            }
                        }
                    ],
                    data: [
                        { $sort: { title: 1 } },
                        { $skip: skip },
                        { $limit: pageLimit }
                    ],
                },
            },
        ]);

        result = result[0];
        const pageInfo = { ...result.metaData[0], booksOnCurrentPage: result.data.length };

        res.status(200).json({
            message: 'success',
            pageInfo: pageInfo,
            books: result.data,
        });

    }

    let result = await Book.aggregate([
        {
            $facet: { //facet runs these operation sin parallel (at the same time)
                metaData: [
                    { $count: 'totalBooks' },
                    {
                        $addFields: {
                            currentPage: page,
                            totalPages: { $ceil: { $divide: ['$totalBooks', pageLimit] } },
                        }
                    }
                ],
                data: [
                    { $sort: { title: 1 } },
                    { $skip: skip },
                    { $limit: pageLimit }
                ],
            },
        },
    ]);

    result = result[0];
    const pageInfo = { ...result.metaData[0], booksOnCurrentPage: result.data.length };
    res.status(200).json({
        message: 'success',
        pageInfo: pageInfo,
        books: result.data,
    });

}

module.exports.addBook = async (req, res) => {
    const book = new Book(req.body.book);
    await book.save();

    res.json({
        message: 'success',
        book: book
    });
}

module.exports.updateBook = async (req, res) => {
    const { id } = req.params;
    const book = await Book.findByIdAndUpdate(id, { ...req.body.book }, { new: true });
    res.status(200).json({
        message: 'success',
        updatedBook: book
    });
}

module.exports.deleteBook = async (req, res) => {
    const { id } = req.params;
    const book = await Book.findByIdAndDelete(id);
    res.json({
        message: `Deleted ${book.title}`,
    });
}

module.exports.getBookByTitle = async (req, res) => {
    const book = await Book.findOne({ title: req.params.title });
    if (!book) {
        const err = new ExpressError('Book not found', 404);
        return res.status(err.statusCode).json({ err });
    }
    res.status(200).json({
        message: 'success',
        book: book
    });
}

module.exports.getBooksInGenre = async (req, res) => {
    const genre = req.params.genre;
    const { rating } = req.query;
    if (rating) {
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
            const err = new ExpressError(`Sorry we could not find any books rated in the range of ${ratingVal} in ${genre}`, 404);
            return res.status(err.statusCode).json({ err });
        }
    }
    const booksInGenre = await Book.find({
        genre: { $in: [genre] }
    });
    if (booksInGenre.length > 0) {
        return res.status(200).json({
            message: 'success',
            totalBooks: booksInGenre.length,
            books: booksInGenre,
        });
    } else {
        const err = new ExpressError(`Sorry we could not find any books in ${genre}`, 404);
        return res.status(err.statusCode).json({ err });
    }
}

module.exports.getBooksByAuthor = async (req, res) => {
    const author = req.params.author;
    const { rating } = req.query;
    if (rating) {
        const ratingVal = parseInt(rating);
        const booksRatedByAuthor = await Book.find({
            author: author,
            rating: { $gte: ratingVal, $lt: ratingVal + 1 }
        });
        if (booksRatedByAuthor.length > 0) {
            return res.status(200).json({
                message: 'success',
                totalBooks: booksRatedByAuthor.length,
                books: booksRatedByAuthor,
            });
        } else {
            const err = new ExpressError(`Sorry we could not find any books rated in the range of ${ratingVal} by ${author}`, 404);
            return res.status(err.statusCode).json({ err });
        }
    }
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
}
