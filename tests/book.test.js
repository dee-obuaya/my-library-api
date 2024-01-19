const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');

require('dotenv').config();


beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_URL);
});

describe('GET /api/books', () => {
    it('should return an object containing books', async () => {
        const res = await request(app).get('/api/books');
        // console.log(res.statusCode, res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body.totalBooks).toBeGreaterThan(0);
    });
});

describe('GET /api/books/:title', () => {
    it('should return an object containing book', async () => {
        const res = await request(app).get(
            '/api/books/Rockstar'
        );
        // console.log(res.statusCode, res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body.book.author).toBe('Jackie Collins');
    });
});

describe('GET /api/books/in/:genre', () => {
    it('should return an object containing books in the same genre', async () => {
        const res = await request(app).get('/api/books/in/Thriller');
        expect(res.statusCode).toBe(200);
        expect(res.body.totalBooks).toBeGreaterThan(0);
        for (let book of res.body.books) {
            expect('Thriller' in book.genre);
        }
    });
});

describe('GET /api/books/by/:author', () => {
    it('should return an object containing books by the same author', async () => {
        const res = await request(app).get('/api/books/by/Dan Brown');
        expect(res.statusCode).toBe(200);
        expect(res.body.totalBooks).toBeGreaterThan(0);
        for (let book of res.body.books) {
            expect(book.author = 'Dan Brown');
        }
    });
});

describe('POST /api/books', () => {
    it('should add a book', async () => {
        const authKey = process.env.AUTH_KEY;
        const res = await request(app).post(`/api/books?authKey=${authKey}`).send({
            book: {
                title: 'Chances',
                author: 'Jackie Collins',
                genre: ['Fiction', 'Drama', 'Crime'],
                rating: 5,
            }
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.book._id);
        expect(res.body.book.title).toBe('Chances');
    });
});

afterEach(async () => {
    await mongoose.connection.close();
});
