const express = require('express');
const router = express.Router();
const { Book, Author, Borrower } = require('../models/schema'); // Importing models from schema.js

// Book CRUD Operations

// Create a book
router.post('/books', async (req, res, next) => {
    try {
        const book = new Book(req.body);
        await book.save();
        res.status(201).send(book);
    } catch (error) {
        next(error);
    }
});

// Get all books
router.get('/books', async (req, res, next) => {
    try {
        const books = await Book.find().populate('author');
        res.status(200).send(books);
        res.send("hshshhs");
    } catch (error) {
        next(error);
    }
});

// Get a book by ID
router.get('/books/:id', async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id).populate('author');
        if (!book) return res.status(404).send({ error: 'Book not found' });
        res.status(200).send(book);
    } catch (error) {
        next(error);
    }
});

// Update a book
router.put('/books/:id', async (req, res, next) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!book) return res.status(404).send({ error: 'Book not found' });
        res.status(200).send(book);
    } catch (error) {
        next(error);
    }
});

router.put('/books/:bookId/availableCopies', async (req, res) => {
    const { bookId } = req.params;  // Get the bookId from the URL params
    const { availableCopies } = req.body;  // Get the new availableCopies value from the request body
    
    // Validate that availableCopies is a valid number
    if (availableCopies < 0) {
        return res.status(400).send('availableCopies cannot be negative.');
    }

    try {
        // Find the book and update its availableCopies field
        const book = await Book.findByIdAndUpdate(
            bookId,
            { availableCopies },
            { new: true }  // Return the updated document
        );

        if (!book) {
            return res.status(404).send('Book not found.');
        }

        // Send the updated book object as the response
        res.status(200).json(book);
    } catch (err) {
        res.status(500).send('Server error');
    }
});


// Delete a book
router.delete('/books/:id', async (req, res, next) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) return res.status(404).send({ error: 'Book not found' });
        res.status(200).send({ message: 'Book deleted successfully', book });
    } catch (error) {
        next(error);
    }
});

// Author CRUD Operations

// Create an author
router.post('/authors', async (req, res, next) => {
    try {
        const author = new Author(req.body);
        await author.save();
        res.status(201).send(author);
    } catch (error) {
        next(error);
    }
});

// Get all authors
router.get('/authors', async (req, res, next) => {
    try {
        const authors = await Author.find();
        res.status(200).send(authors);
    } catch (error) {
        next(error);
    }
});

// Get an author by ID
router.get('/authors/:id', async (req, res, next) => {
    try {
        const author = await Author.findById(req.params.id);
        if (!author) return res.status(404).send({ error: 'Author not found' });
        res.status(200).send(author);
    } catch (error) {
        next(error);
    }
});

// Update an author
router.put('/authors/:id', async (req, res, next) => {
    try {
        const author = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!author) return res.status(404).send({ error: 'Author not found' });
        res.status(200).send(author);
    } catch (error) {
        next(error);
    }
});

// Delete an author
router.delete('/authors/:id', async (req, res, next) => {
    try {
        const author = await Author.findByIdAndDelete(req.params.id);
        if (!author) return res.status(404).send({ error: 'Author not found' });
        res.status(200).send({ message: 'Author deleted successfully', author });
    } catch (error) {
        next(error);
    }
});

// Borrower Operations

// Route to fetch all borrowers
router.get('/borrowers', async (req, res) => {
    try {
        const borrowers = await Borrower.find();
        res.json(borrowers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a borrower
router.post('/borrowers', async (req, res, next) => {
    try {
        const borrower = new Borrower(req.body);
        await borrower.save();
        res.status(201).send(borrower);
    } catch (error) {
        next(error);
    }
});

// Update a borrower
router.put('/borrowers/:id', async (req, res, next) => {
    try {
        const borrower = await Borrower.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!borrower) return res.status(404).send({ error: 'Borrower not found' });
        res.status(200).send(borrower);
    } catch (error) {
        next(error);
    }
});

// Borrow a book
router.post('/borrowers/:id/borrow', async (req, res, next) => {
    try {
        const { bookId } = req.body;
        const borrowerId = req.params.id;

        const book = await Book.findById(bookId);
        if (!book) return res.status(404).send({ error: 'Book not found' });

        const borrower = await Borrower.findById(borrowerId);
        if (!borrower) return res.status(404).send({ error: 'Borrower not found' });

        if (book.availableCopies <= 0) {
            return res.status(400).send({ error: 'No available copies of this book.' });
        }

        const borrowingLimit = borrower.membershipType === 'Premium' ? 10 : 5;
        if (borrower.borrowedBooks.length >= borrowingLimit) {
            return res.status(400).send({ error: `Borrowing limit reached for ${borrower.membershipType} membership.` });
        }

        book.availableCopies -= 1;
        borrower.borrowedBooks.push(bookId);

        await book.save();
        await borrower.save();

        res.status(200).send({ message: 'Book borrowed successfully.', borrower });
    } catch (error) {
        next(error);
    }
});

// Return a book
router.post('/borrowers/:id/return', async (req, res, next) => {
    try {
        const { bookId } = req.body;
        const borrowerId = req.params.id;

        const book = await Book.findById(bookId);
        if (!book) return res.status(404).send({ error: 'Book not found' });

        const borrower = await Borrower.findById(borrowerId);
        if (!borrower) return res.status(404).send({ error: 'Borrower not found' });

        const bookIndex = borrower.borrowedBooks.indexOf(bookId);
        if (bookIndex === -1) {
            return res.status(400).send({ error: 'This book is not borrowed by the borrower.' });
        }

        book.availableCopies += 1;
        borrower.borrowedBooks.splice(bookIndex, 1);

        await book.save();
        await borrower.save();

        res.status(200).send({ message: 'Book returned successfully.', borrower });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
