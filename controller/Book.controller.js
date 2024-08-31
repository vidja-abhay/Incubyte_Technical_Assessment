import Book from '../model/Books.model.js';

export const addBook = async (req, res) => {
    // Destructure relevant properties from the request body
    const { ISBN, title, author, publication_year, user_id, person_id } = req.body;

    try {
        // Create a new Book instance with the provided data
        const newBook = new Book({
            ISBN,
            title,
            author,
            publication_year,
            user_id: user_id || null,  // Default to null if not provided
            person_id: person_id || '000000000000000000000000', // Default admin ID if not provided
        });

        // Save the new book to the database
        const savedBook = await newBook.save();

        // Send a successful response with the saved book data
        res.status(201).json({
            success: true,
            message: 'Book added successfully',
            data: savedBook,
        });
    } catch (error) {
        // Handle errors during book creation
        return res.status(500).json({
            success: false,
            message: 'Failed to add book. Try again',
            error: error.message,
        });
    }
};

export const getAvailableBooks = async (req, res) => {
    try {
        // Find all books with status set to true (available)
        const availableBooks = await Book.find({ status: true });

        // Check if no books are found
        if (availableBooks.length === 0) {
            // Send a response indicating no available books
            return res.status(404).json({
                success: false,
                message: 'No available books found'
            });
        }

        // Send a successful response with the list of available books
        res.status(200).json({
            success: true,
            message: 'Available books retrieved successfully',
            length: availableBooks.length, // Include the number of books
            data: availableBooks,
        });
    } catch (error) {
        // Handle errors during book retrieval
        console.error("Error retrieving available books:", error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve available books. Try again',
            error: error.message,
        });
    }
};