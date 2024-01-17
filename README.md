# Dee's Digital Library API
Welcome to my digital library where I try to keep track of books I've read and share them with you.

## API Documentation

### `GET /books`
- fetches all books available.
- returns two objects, `message` and `books` with the values `success` and an array with  a list of book objects respectively.
- needs no arguments, but can take `genre` or `author` or both as an optional query if searching for something specific.
- additional query (`genre` or `author`) is case sensitive and the first letter must be capitalized.

Sample request: `curl http://localhost:3000/books`
Sample response:
``` json
{
    "message": "success",
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
Sample request (with query): `curl http://localhost:3000/books?genre=Drama&author=Jackie Collins`
Sample response:
``` json
{
    "message": "success",
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
        {
            "_id": "65a17e3a5cb888a3958b4124",
            "title": "Rockstar",
            "author": "Jackie Collins",
            "genre": [
                "Drama"
            ],
            "__v": 0
        }
    ]
}
```

### `GET /books/:title`
- fetches ONE book with matching title.
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

### `POST /books`
- posts a new book to the database.
- requires `title`, `author`, `genre` in json format as an argument.
- returns the following as key-value pairs:
    - `book`: an object of the new book in the database.
    - `message`: 'success'

Sample request: `curl -X POST http://localhost:3000/books -H 'Content-Type: application/json' -d'{"book": {"title": "Are You Afraid Of The Dark", "author": "Sydney Sheldon", "genre": ["Fiction", "Crime", "Thriller"]}}'`

Sample response:
``` json
{
    "message":"success",
    "book":{
        "title":"Are You Afraid Of The Dark",
        "author":"Sydney Sheldon",
        "genre":["Fiction","Crime","Thriller"],
        "_id":"65a71dd552bae444b3b648a9","__v":0}
}
```
