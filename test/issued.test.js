







import { describe, it, expect, vi, beforeEach } from 'vitest';
import { issueBook } from '../controller/User.controller.js';
import Book from '../model/Books.model.js';
import User from '../model/User.model.js';

// Mock the request and response objects
const mockRequest = (body) => ({ body });
const mockResponse = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe('issueBook function', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should issue a book successfully', async () => {
    const req = mockRequest({ userId: 'user123', bookId: 'book123' });
    const res = mockResponse();

    const mockBook = {
      _id: 'book123',
      status: true,
      save: vi.fn().mockResolvedValue({ _id: 'book123', status: false, user_id: 'user123' })
    };

    const mockUser = {
      _id: 'user123',
      issued_books: [],
      save: vi.fn().mockResolvedValue({ _id: 'user123', issued_books: ['book123'] })
    };

    vi.spyOn(Book, 'findById').mockResolvedValue(mockBook);
    vi.spyOn(User, 'findById').mockResolvedValue(mockUser);

    await issueBook(req, res);

    expect(Book.findById).toHaveBeenCalledWith('book123');
    expect(User.findById).toHaveBeenCalledWith('user123');
    expect(mockBook.status).toBe(false);
    expect(mockBook.user_id).toBe('user123');
    expect(mockBook.save).toHaveBeenCalled();
    expect(mockUser.issued_books).toContain('book123');
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      message: 'Book issued successfully',
      data: expect.any(Object)
    }));
  });

  it('should return 404 if book is not found', async () => {
    const req = mockRequest({ userId: 'user123', bookId: 'nonexistent' });
    const res = mockResponse();

    vi.spyOn(Book, 'findById').mockResolvedValue(null);

    await issueBook(req, res);

    expect(Book.findById).toHaveBeenCalledWith('nonexistent');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      message: 'Book not found'
    }));
  });

  it('should return 400 if book is already issued', async () => {
    const req = mockRequest({ userId: 'user123', bookId: 'book123' });
    const res = mockResponse();

    const mockBook = {
      _id: 'book123',
      status: false
    };

    vi.spyOn(Book, 'findById').mockResolvedValue(mockBook);

    await issueBook(req, res);

    expect(Book.findById).toHaveBeenCalledWith('book123');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      message: 'Book is already issued'
    }));
  });

  it('should return 404 if user is not found', async () => {
    const req = mockRequest({ userId: 'nonexistent', bookId: 'book123' });
    const res = mockResponse();

    const mockBook = {
      _id: 'book123',
      status: true
    };

    vi.spyOn(Book, 'findById').mockResolvedValue(mockBook);
    vi.spyOn(User, 'findById').mockResolvedValue(null);

    await issueBook(req, res);

    expect(Book.findById).toHaveBeenCalledWith('book123');
    expect(User.findById).toHaveBeenCalledWith('nonexistent');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      message: 'User not found'
    }));
  });

  it('should return 500 if an error occurs', async () => {
    const req = mockRequest({ userId: 'user123', bookId: 'book123' });
    const res = mockResponse();

    vi.spyOn(Book, 'findById').mockRejectedValue(new Error('Database error'));

    await issueBook(req, res);

    expect(Book.findById).toHaveBeenCalledWith('book123');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      message: 'Failed to issue book. Try again',
      error: 'Database error'
    }));
  });
});