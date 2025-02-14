import express from 'express';
import { 
    createListing, 
    deleteListing, 
    updateListing, 
    getListingDetail, 
    getListings 
} from '../controller/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createListing);
router.delete('/delete/:listingId', verifyToken, deleteListing);
router.put('/update/:listingId', verifyToken, updateListing);
router.get('/get/:listingId', getListingDetail);
router.get('/get', getListings);


export default router;
