import express from 'express';
import { test, updateUser } from '../controller/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);

// update user route and use the verifyToken middleware to check if the user is authorized
router.post('/update/:id', verifyToken, updateUser);

export default router;