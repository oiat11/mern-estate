import express from 'express';
import { signup } from '../controller/auth.controller.js';

const router = express.Router();

// signup route to create a new user
router.post("/signup", signup);

export default router;