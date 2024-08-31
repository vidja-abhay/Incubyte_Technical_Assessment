import express from 'express';
import { addBook ,getAvailableBooks} from '../controller/Book.controller.js';

const router = express.Router();

router.post('/add-book',addBook);
router.get('/available-books',getAvailableBooks);

export default router;