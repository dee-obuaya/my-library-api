const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");

require("dotenv").config();

beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_URL);
});

describe("GET /api/books", () => {
  it("should return an object containing books", async () => {
    const res = await request(app).get("/api/books");
    // console.log(res.statusCode, res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body.pageInfo.totalBooks).toBeGreaterThan(0);
  });
});

describe("GET /api/books/find", () => {
  it("should return an object containing books", async () => {
    const res = await request(app).get("/api/books/find?searchQuery=Dan");
    // console.log(res.statusCode, res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body.books[0].author).toBe("Dan Brown");
  });
});

xdescribe("POST /api/books", () => {
  it("should add a book", async () => {
    const authKey = process.env.AUTH_KEY;
    const res = await request(app)
      .post(`/api/books?authKey=${authKey}`)
      .send({
        book: {
          title: "Chances",
          author: "Jackie Collins",
          genre: ["Fiction", "Drama", "Crime"],
          rating: 5,
          image:
            "https://d28dt1r1iq9r00.cloudfront.net/books/santangelo/chances-cover-us-new.webp",
          bookLink: "https://www.jackiecollins.com/books/chances",
        },
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.book._id);
    expect(res.body.book.title).toBe("Chances");
  });
});

xdescribe("PUT /api/books/:id", () => {
  it("should update a book", async () => {
    const authKey = process.env.AUTH_KEY;
    const res = await request(app)
      .put(`/api/books/65ac43864348a7ac3d2e9217?authKey=${authKey}`)
      .send({
        book: {
          title: "The Lost Symbol",
          author: "Dan Brown",
          genre: ["Fiction", "Adventure", "Thriller"],
          rating: 3.6,
          image:
            "https://danbrown.com/wp-content/themes/danbrown/images/db/covers/tls.jpg",
          bookLink: "https://danbrown.com/the-lost-symbol/",
        },
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.updatedBook.rating).toBe(3.6);
  });
});

xdescribe("DELETE /api/books/:id", () => {
  it("should delete a book", async () => {
    const authKey = process.env.AUTH_KEY;
    const res = await request(app).delete(
      `/api/books/65a9b977c8a2bdd26a1f381e?authKey=${authKey}`
    );
    expect(res.statusCode).toBe(200);
    expect(res.body.message);
  });
});

afterEach(async () => {
    await mongoose.connection.close();
});
