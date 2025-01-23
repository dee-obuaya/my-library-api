if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo');
const bookRoutes = require('./routes/books');

const dbUrl = process.env.MONGO_URL;

const app = express();
app.use(express.json());
app.use(mongoSanitize());

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: `${process.env.SESSION_SECRET}`
    }
});
store.on('error', function (e) {
    console.log('SESSION STORE ERROR', e);
});

const sessionConfig = {
    store,
    name: 'session',
    secret: `${process.env.SESSION_SECRET}`,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true, // cookies only accessible/configurable over https not http
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};

app.use(session(sessionConfig));
app.use(cors());
app.use(helmet({ crossOriginEmbedderPolicy: false }));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.use('/api/books', bookRoutes);


app.get('/', (req, res) => {
    res.status(200).json({
        message: "Welcome to Dumebi's Digital Library",
        goTo: {
            getAllBooks: "url/api/books",
            findBook: "url/api/books/find?rating=[any number between 1-5]&searchQuery=[title of book or author]"
        }
    });
});

app.all('*', (req, res, next) => {
    const err = {}
    err.statusCode = 404;
    err.message = "Page not found";
    next(res.status(statusCode).json({ err }));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no, something went wrong...';
    res.status(statusCode).json({ err });
});

module.exports = app;
