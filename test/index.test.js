import { describe, it, expect, vi, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import dotenv from 'dotenv';
import { connect } from '../index.js';
import userRoutes from '../routes/User.routes.js';
import bookRoutes from '../routes/Book.routes.js';
import { addUser } from '../controller/User.controller.js';  // Adjust the import path as needed
import { addBook, getAvailableBooks } from '../controller/Book.controller.js';  // Adjust the import path as needed
import User from '../model/User.model.js';
import Book from '../model/Books.model.js';

dotenv.config();

// Mock the entire mongoose module
vi.mock('mongoose');

// Mock the User model
vi.mock('../model/User.model.js', () => ({
  default: vi.fn().mockImplementation(() => ({
    save: vi.fn()
  }))
}));

// Mock the Book model
vi.mock('../model/Books.model.js', () => ({
  default: vi.fn().mockImplementation(() => ({
    save: vi.fn()
  }))
}));

describe('Express App', () => {
    let app;
    let server;

    beforeAll(() => {
        // Mock the database connection
        vi.mock('../index.js', () => ({
            connect: vi.fn(),
        }));

        // Create the Express app
        app = express();
        app.get('/', (req, res) => {
            res.send("Backend Working..");
        });
        app.use(express.json());
        app.use('/api/user', userRoutes);
        app.use('/api/book', bookRoutes);

        // Call connectDB
        connect();
    });

    afterEach(() => {
        if (server) {
            server.close();
        }
    });

    afterAll(() => {
        vi.clearAllMocks();
    });

    it('should respond with "Backend Working.." on the root route', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Backend Working..');
    });

    it('should use UserRoute for /api/user', () => {
        const userRoute = app._router.stack.find(
            (layer) => layer.regexp.test('/api/user')
        );
        expect(userRoute).toBeDefined();
    });

    it('should use BookRoute for /api/book', () => {
        const bookRoute = app._router.stack.find(
            (layer) => layer.regexp.test('/api/book')
        );
        expect(bookRoute).toBeDefined();
    });

    it('should call connect when the server starts', () => {
        expect(connect).toHaveBeenCalled();
    });
});

describe('Controller Functions', () => {
    describe('addUser function', () => {
        let req, res;

        beforeEach(() => {
            req = {
                body: {
                    user_id: 'test123',
                    user_name: 'Test User'
                }
            };
            res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn()
            };
        });

        afterEach(() => {
            vi.clearAllMocks();
        });

        it('should successfully add a user', async () => {
            const mockSavedUser = {
                user_id: 'test123',
                user_name: 'Test User',
                issued_books: []
            };

            User.mockImplementationOnce(() => ({
                save: vi.fn().mockResolvedValue(mockSavedUser)
            }));

            await addUser(req, res);

            expect(User).toHaveBeenCalledWith({
                user_id: 'test123',
                user_name: 'Test User',
                issued_books: []
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'User added successfully',
                data: mockSavedUser
            });
        });

        it('should return an error if user addition fails', async () => {
            const errorMessage = 'Failed to save user';
            User.mockImplementationOnce(() => ({
                save: vi.fn().mockRejectedValue(new Error(errorMessage))
            }));

            await addUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Failed to add user. Try again',
                error: errorMessage
            });
        });
    });

    describe('addBook function', () => {
        let req, res;

        beforeEach(() => {
            req = {
                body: {
                    ISBN: '1234567890',
                    title: 'Test Book',
                    author: 'Test Author',
                    publication_year: 2024,
                    user_id: 'user123',
                    person_id: 'person123',
                },
            };
            res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            };
        });

        afterEach(() => {
            vi.clearAllMocks();
        });

        it('should add a book successfully', async () => {
            const mockSavedBook = {
                ISBN: '1234567890',
                title: 'Test Book',
                author: 'Test Author',
                publication_year: 2024,
                user_id: 'user123',
                person_id: 'person123',
            };

            Book.mockImplementationOnce(() => ({
                save: vi.fn().mockResolvedValue(mockSavedBook)
            }));

            await addBook(req, res);

            expect(Book).toHaveBeenCalledWith({
                ISBN: '1234567890',
                title: 'Test Book',
                author: 'Test Author',
                publication_year: 2024,
                user_id: 'user123',
                person_id: 'person123',
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Book added successfully',
                data: mockSavedBook,
            });
        });

        it('should return 500 if book addition fails', async () => {
            const errorMessage = 'Database error';
            Book.mockImplementationOnce(() => ({
                save: vi.fn().mockRejectedValue(new Error(errorMessage))
            }));

            await addBook(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Failed to add book. Try again',
                error: errorMessage,
            });
        });
    });

    describe('getAvailableBooks function', () => {
        let req, res;

        beforeEach(() => {
            req = {};  // No request body needed for this function
            res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            };
        });

        afterEach(() => {
            vi.clearAllMocks();
        });

        it('should retrieve available books successfully', async () => {
            const mockBooks = [
                { ISBN: '1234567890', title: 'Test Book 1', author: 'Test Author 1', publication_year: 2024, status: true },
                { ISBN: '0987654321', title: 'Test Book 2', author: 'Test Author 2', publication_year: 2023, status: true }
            ];

            Book.find = vi.fn().mockResolvedValue(mockBooks);

            await getAvailableBooks(req, res);

            expect(Book.find).toHaveBeenCalledWith({ status: true });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Available books retrieved successfully',
                length: mockBooks.length,
                data: mockBooks,
            });
        });

        it('should return 404 if no available books are found', async () => {
            Book.find = vi.fn().mockResolvedValue([]);

            await getAvailableBooks(req, res);

            expect(Book.find).toHaveBeenCalledWith({ status: true });
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'No available books found'
            });
        });

        it('should return 500 if there is an error retrieving books', async () => {
            const errorMessage = 'Database error';
            Book.find = vi.fn().mockRejectedValue(new Error(errorMessage));

            await getAvailableBooks(req, res);

            expect(Book.find).toHaveBeenCalledWith({ status: true });
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Failed to retrieve available books. Try again',
                error: errorMessage,
            });
        });
    });
});