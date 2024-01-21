const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const bookRoutes = require('./routes/books');


const app = express();
app.use(express.json());
app.use(mongoSanitize());


app.use('/api/books', bookRoutes);


app.get('/', (req, res) => {
    res.status(200).json({message: "Welcome to Dumebi's Digital Library"});
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no, something went wrong...';
    res.status(statusCode).json({ err });
});

module.exports = app;
