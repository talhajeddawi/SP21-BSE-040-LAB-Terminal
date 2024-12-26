// Import Mongoose
const mongoose = require('mongoose');
const axios = require('axios');
// Schema for the Author
const AuthorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format.'],
    },
    phoneNumber: {
        type: String,
        required: true,
        match: [/^\d{11}$/, 'Invalid phone number format. It should be 11 digits.'],
    },
});

// Schema for the Book
const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: true,
    },
    isbn: {
        type: String,
        unique: true,
        required: true,
    },
    availableCopies: {
        type: Number,
        required: true,
        min: [0, 'Available copies cannot be negative.'],
    },
    borrowedCount: {
        type: Number,
        default: 0,
    },
});

// Ensure an author is linked to no more than 5 books when a book is saved
BookSchema.pre('save', async function (next) {
    const bookCount = await mongoose.model('Book').countDocuments({ author: this.author });

    // If author is linked to 5 or more books, prevent saving the new book
    if (bookCount >= 5) {
        throw new Error('An author can be linked to up to 5 books at a time.');
    }

    // Ensure availableCopies doesn’t exceed 100 if borrowedCount > 10
    if (this.borrowedCount > 10 && this.availableCopies > 100) {
        throw new Error('If the book has been borrowed more than 10 times, the available copies cannot exceed 100.');
    }

    next();
});

// Schema for the Borrower
const BorrowerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    borrowedBooks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
        },
    ],
    membershipActive: {
        type: Boolean,
        required: true,
    },
    membershipType: {
        type: String,
        enum: ['Standard', 'Premium'],
        required: true,
    },
});
// Schema for the Borrower with borrowBook method
BorrowerSchema.methods.borrowBook = async function (bookId) {
    const book = await mongoose.model('Book').findById(bookId);
    
    // Check if book exists
    if (!book) {
        throw new Error('Book not found.');
    }

    // Check if the borrower is allowed to borrow the book based on membership type
    const borrowedLimit = this.membershipType === 'Premium' ? 10 : 5;
    if (this.borrowedBooks.length >= borrowedLimit) {
        throw new Error(`Membership type ${this.membershipType} allows borrowing up to ${borrowedLimit} books.`);
    }

    // Check if the book has available copies
    if (book.availableCopies <= 0) {
        throw new Error('No available copies of this book to borrow.');
    }

    // Add the book to the borrower's list
    this.borrowedBooks.push(bookId);
    await this.save();

    // Send a PUT request to update the availableCopies field
    try {
        await axios.put(`http://localhost:3000/books/${bookId}/availableCopies`, {
            availableCopies: book.availableCopies - 1,  // Decrement availableCopies by 1
        });
    } catch (err) {
        throw new Error('Failed to update available copies for the book.');
    }

    // Update the book's borrowedCount directly in the database
    book.borrowedCount += 1;
    await book.save();
};

// Ensure borrowing limits based on membership type
BorrowerSchema.pre('validate', function (next) {
    const borrowedLimit = this.membershipType === 'Premium' ? 10 : 5;
    if (this.borrowedBooks.length > borrowedLimit) {
        throw new Error(
            `Membership type ${this.membershipType} allows borrowing up to ${borrowedLimit} books.`
        );
    }
    next();
});
// Ensure borrowing limits based on membership type
BorrowerSchema.pre('validate', function (next) {
    const borrowedLimit = this.membershipType === 'Premium' ? 10 : 5;
    if (this.borrowedBooks.length > borrowedLimit) {
        throw new Error(
            `Membership type ${this.membershipType} allows borrowing up to ${borrowedLimit} books.`
        );
    }
    next();
});


// Export the models
const Author = mongoose.model('Author', AuthorSchema);
const Book = mongoose.model('Book', BookSchema);
const Borrower = mongoose.model('Borrower', BorrowerSchema);

module.exports = { Author, Book, Borrower };
