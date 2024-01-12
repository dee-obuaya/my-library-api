if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const bookRoutes = require('./routes/books');

const dbUrl = process.env.MONGO_URL;

main()
    .then(() => console.log('Database connected'))
    .catch(err => console.error.bind(console, 'connection error:'));
async function main() {
    await mongoose.connect(dbUrl);
}

const app = express();
app.use(express.json());
app.use(mongoSanitize());


app.use('/books', bookRoutes);


app.get('/', (req, res) => {
    res.status(200).json("Welcome to Dumebi's Digital Library");
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no, something went wrong...';
    res.status(statusCode).json({ err });
});

app.listen(3000, () => {
    console.log('Serving on port 3000');
});
