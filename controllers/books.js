const Book = require("../models/book");
const ExpressError = require("../utils/ExpressError");

const pageLimit = 8;

module.exports.getAllBooks = async (req, res) => {
  // const pageLimit = 8;
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
        $facet: {
          //facet runs these operation sin parallel (at the same time)
          metaData: [
            { $count: "totalBooks" },
            {
              $addFields: {
                currentPage: page,
                totalPages: { $ceil: { $divide: ["$totalBooks", pageLimit] } },
              },
            },
          ],
          data: [
            { $sort: { title: 1 } },
            { $skip: skip },
            { $limit: pageLimit },
          ],
        },
      },
    ]);

    result = result[0];
    const pageInfo = {
      ...result.metaData[0],
      booksOnCurrentPage: result.data.length,
    };

    return res.status(200).json({
      message: "success",
      pageInfo: pageInfo,
      books: result.data,
    });
  }

  let result = await Book.aggregate([
    {
      $facet: {
        //facet runs these operation sin parallel (at the same time)
        metaData: [
          { $count: "totalBooks" },
          {
            $addFields: {
              currentPage: page,
              totalPages: { $ceil: { $divide: ["$totalBooks", pageLimit] } },
            },
          },
        ],
        data: [{ $sort: { title: 1 } }, { $skip: skip }, { $limit: pageLimit }],
      },
    },
  ]);

  result = result[0];
  const pageInfo = {
    ...result.metaData[0],
    booksOnCurrentPage: result.data.length,
  };
  res.status(200).json({
    message: "success",
    pageInfo: pageInfo,
    books: result.data,
  });
};

module.exports.addBook = async (req, res) => {
  const book = new Book(req.body.book);
  await book.save();

  res.json({
    message: "success",
    book: book,
  });
};

module.exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const book = await Book.findByIdAndUpdate(
    id,
    { ...req.body.book },
    { new: true }
  );
  res.status(200).json({
    message: "success",
    updatedBook: book,
  });
};

module.exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  const book = await Book.findByIdAndDelete(id);
  res.json({
    message: `Deleted ${book.title}`,
  });
};

module.exports.getBookByTitle = async (req, res) => {
    const bookTitle = req.params.title;
    const book = await Book.findOne({ title: bookTitle });

    if (!book) {
      const err = new ExpressError("Book not found", 404);
      return res.status(err.statusCode).json({ err });
    } else {
      res.status(200).json({
        message: `Showing result for ${bookTitle}`,
        book: book,
      });
    }
};

module.exports.getBooksInGenre = async (req, res) => {
  const genre = req.params.genre;
  let { rating, page = 1 } = req.query;
  if (isNaN(page) || page < 1) {
    page = 1;
  }
  const skip = (page - 1) * pageLimit;

  if (rating && !isNaN(rating) && !(rating > 5) && !(rating < 1)) {
    const ratingVal = parseInt(rating);
    let result = await Book.aggregate([
      {
        $match: {
          genre: { $regex: genre, $options: "i" },
          rating: { $gte: ratingVal, $lt: ratingVal + 1 },
        },
      },
      {
        $facet: {
          metaData: [
            { $count: "totalBooks" },
            {
              $addFields: {
                currentPage: page,
                totalPages: { $ceil: { $divide: ["$totalBooks", pageLimit] } },
              },
            },
          ],
          data: [
            { $sort: { title: 1 } },
            { $skip: skip },
            { $limit: pageLimit },
          ],
        },
      },
    ]);

    result = result[0];
    const pageInfo = {
      ...result.metaData[0],
      booksOnCurrentPage: result.data.length,
    };

    if (result.data.length > 0) {
      return res.status(200).json({
        message: `Showing results for books in ${genre}`,
        pageInfo: pageInfo,
        books: result.data,
      });
    } else {
      const err = new ExpressError(
        `Sorry we could not find any books in ${genre} with a rating in the range of ${rating}`,
        404
      );
      return res.status(err.statusCode).json({ err });
    }
  }

  let result = await Book.aggregate([
    {
      $match: {
        genre: { $regex: genre, $options: "i" },
      },
    },
    {
      $facet: {
        metaData: [
          { $count: "totalBooks" },
          {
            $addFields: {
              currentPage: page,
              totalPages: { $ceil: { $divide: ["$totalBooks", pageLimit] } },
            },
          },
        ],
        data: [{ $sort: { title: 1 } }, { $skip: skip }, { $limit: pageLimit }],
      },
    },
  ]);

  result = result[0];
  const pageInfo = {
    ...result.metaData[0],
    booksOnCurrentPage: result.data.length,
  };

  if (result.data.length > 0) {
    return res.status(200).json({
      message: `Showing results for books in ${genre}`,
      pageInfo: pageInfo,
      books: result.data,
    });
  } else {
    const err = new ExpressError(
      `Sorry we could not find any books in ${genre}`,
      404
    );
    return res.status(err.statusCode).json({ err });
  }
};

module.exports.getBooksByAuthor = async (req, res) => {
  const author = req.params.author;
  let { rating, page = 1 } = req.query;
  if (isNaN(page) || page < 1) {
    page = 1;
  }
  const skip = (page - 1) * pageLimit;

  if (rating && !isNaN(rating) && !(rating > 5) && !(rating < 1)) {
    const ratingVal = parseInt(rating);
    let result = await Book.aggregate([
      {
        $match: {
          author: { $regex: author, $options: "i" },
          rating: { $gte: ratingVal, $lt: ratingVal + 1 },
        },
      },
      {
        $facet: {
          metaData: [
            { $count: "totalBooks" },
            {
              $addFields: {
                currentPage: page,
                totalPages: { $ceil: { $divide: ["$totalBooks", pageLimit] } },
              },
            },
          ],
          data: [
            { $sort: { title: 1 } },
            { $skip: skip },
            { $limit: pageLimit },
          ],
        },
      },
    ]);

    result = result[0];
    const pageInfo = {
      ...result.metaData[0],
      booksOnCurrentPage: result.data.length,
    };

    if (result.data.length > 0) {
      return res.status(200).json({
        message: "success",
        pageInfo: pageInfo,
        books: result.data,
      });
    } else {
      const err = new ExpressError(
        `Sorry we could not find any books by ${author} rated in the range of ${ratingVal}`,
        404
      );
      return res.status(err.statusCode).json({ err });
    }
  }

  let result = await Book.aggregate([
    {
      $match: {
        author: { $regex: author, $options: "i" },
      },
    },
    {
      $facet: {
        metaData: [
          { $count: "totalBooks" },
          {
            $addFields: {
              currentPage: page,
              totalPages: { $ceil: { $divide: ["$totalBooks", pageLimit] } },
            },
          },
        ],
        data: [{ $sort: { title: 1 } }, { $skip: skip }, { $limit: pageLimit }],
      },
    },
  ]);

  result = result[0];
  const pageInfo = {
    ...result.metaData[0],
    booksOnCurrentPage: result.data.length,
  };

  if (result.data.length > 0) {
    return res.status(200).json({
      message: "success",
      pageInfo: pageInfo,
      books: result.data,
    });
  } else {
    const err = new ExpressError(
      `Sorry we could not find any books by ${author}`,
      404
    );
    return res.status(err.statusCode).json({ err });
  }
};
