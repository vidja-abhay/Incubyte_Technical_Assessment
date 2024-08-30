import express from 'express'

import { addUser } from '../controller/User.controller.js';

const router = express.Router()

router.post('/addUsers', addUser);

export default router