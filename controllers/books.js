const Book = require("../models/book");
const ExpressError = require("../utils/ExpressError");

const pageLimit = 8;

module.exports.getAllBooks = async (req, res) => {
  let { page = 1 } = req.query;
  if (isNaN(page) || page < 1) {
    page = 1;
  }
  const skip = (page - 1) * pageLimit;

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
  const isDup = async(title, author) => {
    const dupBookData = await Book.aggregate([
      { $match: { title: title, author: author } },
      {
        $facet: {
          //facet runs these operations in parallel (at the same time)
          metaData: [
            { $count: "book" },
          ]
        },
      },
    ]);
    console.log();
    if ((dupBookData[0].metaData[0].book) === 1) return true;
  }
  const dupBook = await isDup(book.title, book.author);

  if (isDup) {
    const err = new ExpressError(
      `That book already exists`,
      400
    );
    return res.status(err.statusCode).json({ err });
  }

  return res.json({
    message: "success",
    book: book,
    dupBook: dupBook
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

module.exports.findBooks = async (req, res) => {
  let { rating, page = 1, searchQuery } = req.query;
  let result;
  if (isNaN(page) || page < 1) {
    page = 1;
  }
  const skip = (page - 1) * pageLimit;
  const ratingVal = parseInt(rating);

  if (!isNaN(ratingVal) && !(ratingVal > 5) && !(ratingVal < 1) && searchQuery == "") {
    result = await Book.aggregate([
      {
        $match: {
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
    console.log(result);
    const pageInfo = {
      ...result.metaData[0],
      booksOnCurrentPage: result.data.length,
    };

    if (result.data.length > 0) {
      return res.status(200).json({
        message: `Showing results for books rated ${ratingVal}`,
        pageInfo: pageInfo,
        books: result.data,
      });
    } else {
      const err = new ExpressError(
        `Sorry we could not find any books rated ${ratingVal}`,
        404
      );
      return res.status(err.statusCode).json({ err });
    }
  } else if (
    !isNaN(ratingVal) &&
    !(ratingVal > 5) &&
    !(ratingVal < 1) &&
    searchQuery !== ""
  ) {
    result = await Book.aggregate([
      {
        $match: {
          $or: [
            { author: { $regex: searchQuery, $options: "i" } },
            { title: { $regex: searchQuery, $options: "i" } },
            { genre: { $regex: searchQuery, $options: "i" } },
          ],
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
        message: `Showing results for ${searchQuery} rated ${ratingVal}`,
        pageInfo: pageInfo,
        books: result.data,
      });
    } else {
      const err = new ExpressError(
        `Sorry we could not find any books matching ${searchQuery} rated ${ratingVal}`,
        404
      );
      return res.status(err.statusCode).json({ err });
    }
  }

  result = await Book.aggregate([
    {
      $match: {
        $or: [
          { author: { $regex: searchQuery, $options: "i" } },
          { title: { $regex: searchQuery, $options: "i" } },
          { genre: { $regex: searchQuery, $options: "i" } },
        ],
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
      message: `Showing results for ${searchQuery}`,
      pageInfo: pageInfo,
      books: result.data,
    });
  } else {
    const err = new ExpressError(
      `Sorry we could not find any books matching ${searchQuery}`,
      404
    );
    return res.status(err.statusCode).json({ err });
  }
};
