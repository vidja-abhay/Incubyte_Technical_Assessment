// Import necessary modules and models
import User from '../model/User.model.js';  // Import User model
import Book from '../model/Books.model.js';  // Import Book model
import mongoose from 'mongoose';  // Import Mongoose for ObjectId validation

export const addUser = async (req, res) => {
    const {user_id, user_name} = req.body;

    try {
        // Create a new user instance with the provided user_id and user_name
        const newUser = new User({
            user_id,
            user_name,
            issued_books : []  // Initialize the issued_books array as empty
        });

        // Save the new user to the database
        const savedUser = await newUser.save();

        // Return success response with the saved user data
        res.status(201).json({
            success: true,
            message: 'User added successfully',
            data: savedUser
        });
    } catch (error) {
        // Return error response if user addition fails
        return res.status(500).json({
            success: false,
            message: 'Failed to add user. Try again',
            error: error.message,
        });
    }
};

export const issueBook = async (req, res) => {
    const { userId, bookId } = req.body;

    try {
        // Find the book by its ID
        const book = await Book.findById(bookId);

        if (!book) {
            // Return 404 if the book is not found
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        if (!book.status) {  // Check if the book is already issued (status is false)
            return res.status(400).json({
                success: false,
                message: 'Book is already issued'
            });
        }

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            // Return 404 if the user is not found
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update the book's status to false (issued) and set the user_id to the user's ID
        book.status = false;
        book.user_id = userId;

        // Save the updated book in the database
        const updatedBook = await book.save();

        // Add the book's ID to the user's issued_books array
        user.issued_books.push(bookId);

        // Save the updated user in the database
        const updatedUser = await user.save();

        // Return success response with the updated book and user data
        res.status(200).json({
            success: true,
            message: 'Book issued successfully',
            data: {
                book: updatedBook,
                user: updatedUser
            }
        });
    } catch (error) {
        // Return error response if book issuing fails
        return res.status(500).json({
            success: false,
            message: 'Failed to issue book. Try again',
            error: error.message,
        });
    }
};

export const returnBook = async (req, res) => {
    const { userId, bookId } = req.body;

    try {
        // Validate the provided ObjectIds to ensure they are valid MongoDB ObjectIds
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid User ID or Book ID'
            });
        }

        // Find the book by its ID
        const book = await Book.findById(bookId);

        if (!book) {
            // Return 404 if the book is not found
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        if (book.status) {  // Check if the book is already available (status is true)
            return res.status(400).json({
                success: false,
                message: 'Book is already available'
            });
        }

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            // Return 404 if the user is not found
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if the book is in the user's issued_books array
        if (!user.issued_books.includes(bookId)) {
            return res.status(400).json({
                success: false,
                message: 'Book is not issued to this user'
            });
        }

        // Update the book's status to true (available) and clear the user_id
        book.status = true;
        book.user_id = null;

        // Save the updated book in the database
        const updatedBook = await book.save();

        // Remove the book's ID from the user's issued_books array
        user.issued_books = user.issued_books.filter(id => !id.equals(bookId));

        // Save the updated user in the database
        const updatedUser = await user.save();

        // Return success response with the updated book and user data
        res.status(200).json({
            success: true,
            message: 'Book returned successfully',
            data: {
                book: updatedBook,
                user: updatedUser
            }
        });
    } catch (error) {
        // Log the error and return error response if book returning fails
        console.error("Error returning book:", error);
        return res.status(500).json({
            success: false,
            message: 'Failed to return book. Try again',
            error: error.message,
        });
    }
};
