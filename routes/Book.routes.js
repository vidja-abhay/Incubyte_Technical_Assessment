import express from 'express'

import { addBook } from '../controller/Book.controller.js'
const router = express.Router()

router.post('/addBook', addBook);

export default router