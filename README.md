# Dee's Digital Library API
Welcome to my digital library where I try to keep track of books I've read and share them with you.

## API Documentation

baseUrl = `https://my-library-api-mbl2.onrender.com`

### `GET /api/books`
- fetches all books available.
- returns three objects, `message`, `pageInfo` and `books` with the values `success`, an object and an array with of book objects respectively.
- needs no arguments, but can take `rating` as an optional query if searching for books within that range.

Sample request: `curl baseUrl/api/books`

Sample response:
``` json
{
    "message": "success",
    "pageInfo": {
        "totalBooks": 8,
        "currentPage": 1,
        "totalPages": 1,
        "booksOnCurrentPage": 8
    },
    "books": [
        {
            "_id": "660b05689483eab18c66dcf",
            "title": "Chances",
            "author": "Jackie Collins",
            "genre": [
                "Fiction",
                "Drama",
                "Crime"
            ],
            "rating": 5,
            "image": "https://d28dt1r1iq9r00.cloudfront.net/books/santangelo/chances-cover-us-new.webp",
            "bookLink": "https://www.jackiecollins.com/books/chances",
            "__v": 0
        },
        {
            "_id": "660b05689483eab18c66dd0",
            "title": "Deadly Embrace",
            "author": "Jackie Collins",
            "genre": [
                "Fiction",
                "Crime",
                "Drama"
            ],
            "rating": 4.6,
            "image": "https://d28dt1r1iq9r00.cloudfront.net/books/madison-castelli/deadly-embrace-cover-us.webp",
            "bookLink": "https://www.jackiecollins.com/books/deadly-embrace",
            "__v": 0
        },
        {
            "_id": "660b05679483eab18c66dcf",
            "title": "Deadly Embrace",
            "author": "Jackie Collins",
            "genre": [
                "Fiction",
                "Crime",
                "Drama"
            ],
            "rating": 4.6,
            "image": "https://d28dt1r1iq9r00.cloudfront.net/books/madison-castelli/deadly-embrace-cover-us.webp",
            "bookLink": "https://www.jackiecollins.com/books/deadly-embrace",
            "__v": 0
        },
        {
            "_id": "660b05689483eab18c66dcf",
            "title": "Inferno",
            "author": "Dan Brown",
            "genre": [
                "Fiction",
                "Thriller"
            ],
            "rating": 3.9,
            "image": "https://danbrown.com/wp-content/uploads/2013/05/inferno_166x251.jpg",
            "bookLink": "https://danbrown.com/inferno/",
            "__v": 0
        },
        {
            "_id": "660b05679483eab18c66dcf",
            "title": "The 7 Habits of Highly Effective People",
            "author": "Stephen R. Covey",
            "genre": [
                "Self-help"
            ],
            "rating": 3.8,
            "image": "https://books.google.com.ng/books/content?id=upUxaNWSaRIC&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE73M_84ZyQW2cm0pW351kKZlOomqYxSwdds8IuAOPpRJvOiNOO4TXNACKklgC0BiErOaEI0GcGQXtUGO550XfCjYSVq7WZ7AvG6VrLl7xwhoPhRqoSOGyk42hwNHx8Rip4e2twX6",
            "bookLink": "https://books.google.com.ng/books/about/The_7_Habits_of_Highly_Effective_People.html?id=upUxaNWSaRIC&redir_esc=y",
            "__v": 0
        },
        {
            "_id": "660b05689483eab18c66dcf",
            "title": "The Da Vinci Code",
            "author": "Dan Brown",
            "genre": [
                "Fiction",
                "Adventure",
                "Thriller"
            ],
            "rating": 3.5,
            "image": "https://danbrown.com/wp-content/themes/danbrown/images/db/covers/dvc.jpg",
            "bookLink": "https://danbrown.com/the-davinci-code/",
            "__v": 0
        },
        {
            "_id": "660b05679483eab18c66dcf",
            "title": "The Lost Symbol",
            "author": "Dan Brown",
            "genre": [
                "Fiction",
                "Adventure",
                "Thriller"
            ],
            "rating": 4,
            "image": "https://danbrown.com/wp-content/themes/danbrown/images/db/covers/tls.jpg",
            "bookLink": "https://danbrown.com/the-lost-symbol/",
            "__v": 0
        },
        {
            "_id": "660b05689483eb18c66dcfc",
            "title": "Windmills Of The Gods",
            "author": "Sidney Sheldon",
            "genre": [
                "Fiction",
                "Thriller",
                "Mystery",
                "Suspense"
            ],
            "rating": 3.86,
            "image": "https://upload.wikimedia.org/wikipedia/en/1/1c/WindmillsOfTheGods.jpg",
            "bookLink": "https://www.goodreads.com/en/book/show/119389",
            "__v": 0
        }
    ]
}
```

### `GET /api/books/find`
- fetches book(s) matching the `searchQuery` and/or `rating` param if provided.
- returns two objects, `message` and `book` with the values `success` and a book object.

Sample request: `curl baseUrl/api/books/find?rating=3&searchQuery=sidney`
Sample response:
``` json
{
    "message": "Showing results for sidney rated 3",
    "pageInfo": {
        "totalBooks": 2,
        "currentPage": 1,
        "totalPages": 1,
        "booksOnCurrentPage": 2
    },
    "books": [
        {
            "_id": "65b53715a6fe5272b1d0dbdd",
            "title": "Are You Afraid Of The Dark?",
            "author": "Sidney Sheldon",
            "genre": [
                "Thriller",
                "Suspense",
                "Mystery"
            ],
            "rating": 3.6,
            "image": "https://upload.wikimedia.org/wikipedia/en/4/41/AreYouAfraidOfTheDark.jpg",
            "bookLink": "https://www.goodreads.com/en/book/show/43324",
            "__v": 0
        },
        {
            "_id": "65b53ad2a6fe5272b1d0dbf3",
            "title": "Windmills Of The Gods",
            "author": "Sidney Sheldon",
            "genre": [
                "Fiction",
                "Thriller",
                "Mystery",
                "Suspense"
            ],
            "rating": 3.86,
            "image": "https://upload.wikimedia.org/wikipedia/en/1/1c/WindmillsOfTheGods.jpg",
            "bookLink": "https://www.goodreads.com/en/book/show/119389",
            "__v": 0
        }
    ]
}
```
