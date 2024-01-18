const express = require('express');
const router = express.Router();
const books = require('../controllers/books');
const catchAsync = require('../utils/catchAsync');
const { isAuthorized, validateBook } = require('../middleware');


router.route('/')
    .get(catchAsync(books.index))
    .post(isAuthorized, validateBook, catchAsync(books.addBook));

router.route('/:id')
    .put(isAuthorized, validateBook, catchAsync(books.updateBook))
    .delete(isAuthorized, catchAsync(books.deleteBook));

router.get('/:title', catchAsync(books.getBook));

router.get('/in/:genre', catchAsync(books.getBooksInGenre));

router.get('/by/:author', catchAsync(books.getBooksByAuthor));


module.exports = router;
