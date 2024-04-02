const express = require('express');
const router = express.Router();
const books = require('../controllers/books');
const catchAsync = require('../utils/catchAsync');
const { isAuthorized, validateBook } = require('../middleware');


router.route('/')
    .get(catchAsync(books.getAllBooks))
    .post(isAuthorized, validateBook, catchAsync(books.addBook));

router.route('/:id')
    .put(isAuthorized, validateBook, catchAsync(books.updateBook))
    .delete(isAuthorized, catchAsync(books.deleteBook));

router.get('/find', catchAsync(books.findBooks));

module.exports = router;
