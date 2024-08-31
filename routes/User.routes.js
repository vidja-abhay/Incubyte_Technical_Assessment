import express from 'express'

import { addUser, issueBook, returnBook } from '../controller/User.controller.js';

const router = express.Router()

router.post('/addUsers', addUser);
router.post('/issued-book',issueBook);
router.post('/return-book',returnBook);


export default router