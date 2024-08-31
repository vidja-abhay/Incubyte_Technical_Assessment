import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import mongoose from 'mongoose';
import { returnBook } from '../controller/User.controller.js'; // Update the path to your controller
import Book from '../model/Books.model.js'; // Update the path to your Book model
import User from '../model/User.model.js'; // Update the path to your User model

// Mock database methods
vi.mock('../model/Books.model.js');
vi.mock('../model/User.model.js');

describe('returnBook', () => {
    beforeEach(() => {
        // Clear mocks before each test
        vi.clearAllMocks();
    });

    it('should return 400 if the userId or bookId is invalid', async () => {
        const req = { body: { userId: 'invalidId', bookId: 'invalidId' } };
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

        await returnBook(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Invalid User ID or Book ID'
        });
    });

    it('should return 404 if the book is not found', async () => {
        const req = { body: { userId: new mongoose.Types.ObjectId(), bookId: new mongoose.Types.ObjectId() } };
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

        Book.findById.mockResolvedValue(null);

        await returnBook(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Book not found'
        });
    });

    it('should return 400 if the book is already available', async () => {
        const req = { body: { userId: new mongoose.Types.ObjectId(), bookId: new mongoose.Types.ObjectId() } };
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

        Book.findById.mockResolvedValue({ status: true });

        await returnBook(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Book is already available'
        });
    });

    it('should return 404 if the user is not found', async () => {
        const req = { body: { userId: new mongoose.Types.ObjectId(), bookId: new mongoose.Types.ObjectId() } };
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

        Book.findById.mockResolvedValue({ status: false, user_id: new mongoose.Types.ObjectId() });
        User.findById.mockResolvedValue(null);

        await returnBook(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'User not found'
        });
    });

    it('should return 400 if the book is not issued to the user', async () => {
        const req = { body: { userId: new mongoose.Types.ObjectId(), bookId: new mongoose.Types.ObjectId() } };
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

        Book.findById.mockResolvedValue({ status: false, user_id: new mongoose.Types.ObjectId() });
        User.findById.mockResolvedValue({ issued_books: [new mongoose.Types.ObjectId()] });

        await returnBook(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Book is not issued to this user'
        });
    });

    it('should return 200 and update the book and user if everything is valid', async () => {
        const req = { body: { userId: new mongoose.Types.ObjectId(), bookId: new mongoose.Types.ObjectId() } };
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

        Book.findById.mockResolvedValue({
            status: false,
            user_id: req.body.userId,
            save: vi.fn().mockResolvedValue({ status: true, user_id: null })
        });
        User.findById.mockResolvedValue({
            issued_books: [req.body.bookId],
            save: vi.fn().mockResolvedValue({ issued_books: [] })
        });

        await returnBook(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Book returned successfully',
            data: {
                book: { status: true, user_id: null },
                user: { issued_books: [] }
            }
        });
    });

    it('should handle errors properly', async () => {
        const req = { body: { userId: new mongoose.Types.ObjectId(), bookId: new mongoose.Types.ObjectId() } };
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

        vi.spyOn(console, 'error').mockImplementation(() => {}); // Mock console.error to avoid cluttering test output
        Book.findById.mockRejectedValue(new Error('Database error'));

        await returnBook(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Failed to return book. Try again',
            error: 'Database error'
        });
    });
});