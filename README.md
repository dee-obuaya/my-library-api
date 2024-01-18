# Dee's Digital Library API
Welcome to my digital library where I try to keep track of books I've read and share them with you.

## API Documentation

### `GET /books`
- fetches all books available.
- returns three objects, `message`, `totalBooks` and `books` with the values `success`, an integer and an array with a list of book objects respectively.
- needs no arguments, but can take `rating` as an optional query if searching for books within that range.

Sample request: `curl http://localhost:3000/books`
Sample response:
``` json
{
    "message": "success",
    "totalBooks": 1,
    "books": [
        {
            "_id": "659ec7911954d332944e5a96",
            "title": "Deadly Embrace",
            "author": "Jackie Collins",
            "genre": [
                "Fiction",
                "Crime",
                "Drama"
            ],
            "__v": 0
        },
    ]
}
```

Sample request (with query): `curl http://localhost:3000/books?rating=3`
Sample response:
``` json
{
    "message": "success",
    "totalBooks": 2,
    "books": [
        {
            "_id": "65a85f03379657a3a3081c44",
            "title": "The 7 Habits of Highly Effective People",
            "author": "Stephen R. Covey",
            "genre": [
                "Non-Fiction",
                "Self-help"
            ],
            "rating": 3.8,
            "__v": 0
        },
        {
            "_id": "65a85f03379657a3a3081c46",
            "title": "DaVinci Code",
            "author": "Dan Brown",
            "genre": [
                "Fiction",
                "Adventure",
                "Thriller"
            ],
            "rating": 3.5,
            "__v": 0
        }
    ]
}
```

### `GET /books/:title`
- fetches ONE book with matching `title`.
- returns two objects, `message` and `book` with the values `success` and a book object.

Sample request: `curl http://localhost:3000/books/Rockstar`
Sample response:
``` json
{
    "message": "success",
    "book": {
        "_id": "65a17e3a5cb888a3958b4124",
        "title": "Rockstar",
        "author": "Jackie Collins",
        "genre": [
            "Drama"
        ],
        "__v": 0
    }
}
```

### `GET /books/in/:genre`
- fetches all book in `genre`.
- returns three objects; `message`, `totalBooks`, `books` with the values `success`, an integer and an array with a list of book objects respectively.
- `genre` is case sensitive and first letter of each word must be capitalized.
- needs no arguments, but can take `rating` as an optional query if searching for books within that range in  `genre`.

Sample request: `curl http://localhost:3000/books/in/Fiction`
Sample response:
``` json
{
    "message": "success",
    "totalBooks": 3,
    "books": [
        {
            "_id": "65a85f03379657a3a3081c40",
            "title": "The Lost Symbol",
            "author": "Dan Brown",
            "genre": [
                "Fiction",
                "Adventure",
                "Thriller"
            ],
            "rating": 4,
            "__v": 0
        },
        {
            "_id": "65a85f03379657a3a3081c42",
            "title": "Deadly Embrace",
            "author": "Jackie Collins",
            "genre": [
                "Fiction",
                "Crime",
                "Drama"
            ],
            "rating": 4.6,
            "__v": 0
        },
        {
            "_id": "65a85f03379657a3a3081c46",
            "title": "DaVinci Code",
            "author": "Dan Brown",
            "genre": [
                "Fiction",
                "Adventure",
                "Thriller"
            ],
            "rating": 3.5,
            "__v": 0
        }
    ]
}
```

### `GET /books/by/:author`
- fetches all books by `author`.
- returns three objects; `message`, `totalBooks`, `books` with the values `success`, an integer and an array with a list of book objects respectively.
- `author` is case sensitive and first letter of each word must be capitalized.
- needs no arguments, but can take `rating` as an optional query if searching for books within that range by `author`.

Sample request: `curl http://localhost:3000/books/by/Jackie Collins`
Sample response:
``` json
{
    "message": "success",
    "totalBooks": 1,
    "books": [
        {
            "_id": "65a85f03379657a3a3081c42",
            "title": "Deadly Embrace",
            "author": "Jackie Collins",
            "genre": [
                "Fiction",
                "Crime",
                "Drama"
            ],
            "rating": 4.6,
            "__v": 0
        }
    ]
}
```

### `POST /books`
- posts a new book to the database.
- requires `title`, `author`, `genre`, `rating` in json format as an argument.
- returns the following as key-value pairs:
    - `book`: an object of the new book in the database.
    - `message`: 'success'.

Sample request: `curl -X POST http://localhost:3000/books -H 'Content-Type: application/json' -d'{"book": {"title": "Are You Afraid Of The Dark", "author": "Sydney Sheldon", "genre": ["Fiction", "Crime", "Thriller"], "rating": 4.2}}'`

Sample response:
``` json
{
    "message": "success",
    "book": {
        "title": "Are You Afraid Of The Dark",
        "author": "Sydney Sheldon",
        "genre": [
            "Fiction",
            "Crime",
            "Thriller"
        ],
        "rating": 4.2,
        "_id": "65a9b1e8a39a7806367717a3",
        "__v": 0
    }
}
```

### `PUT /books/:id`
- updates the book with the specified `id`.
- requires `title`, `author`, `genre`, `rating` in json format as an argument.
- returns the following as key-value pairs:
    - `message`: 'success'.
    - `updatedBook`: an object of the updated book in the database.

Sample request: `curl -X PUT http://localhost:3000/books/65a9b1e8a39a7806367717a3 -H 'Content-Type: application/json' -d'{"book": {"title": "Are You Afraid Of The Dark?", "author": "Sydney Sheldon", "genre": ["Fiction", "Thriller"], "rating": 4.3}}'`
Sample response:
``` json
{
    "message": "success",
    "updatedBook": {
        "_id": "65a9b1e8a39a7806367717a3",
        "title": "Are You Afraid Of The Dark?",
        "author": "Sydney Sheldon",
        "genre": [
            "Fiction",
            "Thriller"
        ],
        "rating": 4.3,
        "__v": 0
    }
}
```


### `DELETE /books/:id`
- deletes the book with the specified `id`.
- returns the following as key-value pairs:
    - `message`: 'Deleted {book.title}'.

Sample request: `curl -X DELETE http://localhost:3000/books/659ec7911954d332944e5a93`
Sample response:
``` json
{
    "message":"Deleted The Lost Symbol"
}
```
