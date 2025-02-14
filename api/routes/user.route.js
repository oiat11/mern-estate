import express from 'express';
import { 
    test, 
    updateUser, 
    deleteUser, 
    getUserListings, 
    getUser, 
    addSavedListing, 
    removeSavedListing 
} from '../controller/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);

router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.get('/listings/:userId', verifyToken, getUserListings);
router.get('/:userId', verifyToken, getUser);

router.post('/saved/:listingId', verifyToken, addSavedListing); 
router.delete('/saved/:listingId', verifyToken, removeSavedListing); 

export default router;
