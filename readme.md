# SP21-BSE-040 TALHA MEHMOOD LAB TERMINAL WEB

I tried to perform all the instructions that were written in the question paper. 
1. Firstly i create schemas for Authors, Books and Borrowers.
2. The schema were ready to be used in MongoDB.
3. Then i created the APIs to call for performing CRUD operations.
4. All the CRUD operations were being performed using APIs.
5. I applied the logic that email shall be perfectly formatted for author.
6. I applied the logic that phone number shall be of 11 characters.
7. I also applied the logic that no author can be linked to more than 5 books.
8. I also applied the logic that if borrowCount > 10, the availableCopies shall be < 100.
9. The logic to borrow the book.
10. The logic to return the book.
11. All of the tests were verified using POSTMAN.

# Library Management System API

This is a RESTful API for a Library Management System built with Node.js, Express, and MongoDB. The system allows management of books, authors, and borrowers. 

## Features

- CRUD operations for Books and Authors
- Borrow and return books for Borrowers
- Membership-based borrowing limits (Premium and Regular memberships)

## Prerequisites

- Node.js
- MongoDB
- Postman or any API testing tool

# API Endpoints
# Books
    GET /books
    Retrieve a list of all books.

# POST /books
    Add a new book.

# GET /books/:id
    Get a book by ID.

# PUT /books/:id
    Update a book by ID.

# PUT /books/:bookId/availableCopies
    Update the available copies of a book.

# DELETE /books/:id
    Delete a book by ID.

# Authors
# GET /authors
    Retrieve a list of all authors.

# POST /authors
#   Add a new author.

# GET /authors/:id
#   Get an author by ID.

# PUT /authors/:id
#   Update an author by ID.

# DELETE /authors/:id
#   Delete an author by ID.

# Borrowers
# GET /borrowers
#   Retrieve a list of all borrowers.

# POST /borrowers
#   Add a new borrower.

# GET /borrowers/:id
#   Get a borrower by ID.

# PUT /borrowers/:id
#   Update a borrower by ID.

# POST /borrowers/:id/borrow
#   Borrow a book.

# Requires the book ID in the request body.
#   POST /borrowers/:id/return
#   Return a borrowed book.

#   Requires the book ID in the request body.
