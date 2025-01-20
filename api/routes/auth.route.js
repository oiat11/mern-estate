import express from 'express';
import { signup, signin } from '../controller/auth.controller.js';
import { google } from '../controller/auth.controller.js';

const router = express.Router();

// signup route to create a new user
router.post("/signup", signup);

// signin route to sign in a user
router.post("/signin", signin);

router.post('/google', google);

export default router;