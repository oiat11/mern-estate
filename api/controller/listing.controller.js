import { parse } from 'dotenv';
import Listing from '../models/listing.model.js';

export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
};

export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.listingId);
    if (!listing) {
        return next(errorHandler(404, 'Listing not found'));
    }
    if (listing.userRef !== req.user.id) {
        return next(errorHandler(401, 'You are not authorized to delete this listing'));
    }
    try {
        await Listing.findByIdAndDelete(req.params.listingId);
        res.status(200).json('Listing has been deleted');
    } catch (error) {
        next(error);
    }
};

export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.listingId);
    if (!listing) {
        return next(errorHandler(404, 'Listing not found'));
    }
    if (listing.userRef !== req.user.id) {
        return next(errorHandler(401, 'You are not authorized to update this listing'));
    }
    try {
        const updatedListing = await Listing.findByIdAndUpdate(req.params.listingId, req.body, { new: true });
        res.status(200).json(updatedListing);
    } catch (error) {
        next(error);
    }
};

export const getListingDetail = async (req, res, next) => {
    try{
        const listing = await Listing.findById(req.params.listingId);
        if (!listing) {
            return next(errorHandler(404, 'Listing not found'));
        }
        res.status(200).json(listing);

    } catch (error) {
        next(error);
    }

};

export const getListings = async (req, res, next) => {
    try{
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;

        let furnished = req.query.furnished;
        if (furnished === undefined || furnished === 'false') {
            furnished = {$in: [false, true]};
        }

        let parking = req.query.parking;
        if (parking === undefined || parking === 'false') {
            parking = {$in: [false, true]};
        }

        let type= req.query.type;
        if (type === undefined || type === 'all') {
            type = {$in: ['sale', 'rent']};
        }

        const searchTerm = req.query.searchTerm || '';

        const sort = req.query.sort || 'createdAt';

        const order = req.query.order || 'desc';

        const listings = await Listing.find({
            title: { $regex: searchTerm, $options: 'i' },
            furnished,
            parking,
            type,
        }).sort(
            {[sort]: order}
        ).limit(limit).skip(startIndex);

        return res.status(200).json(listings);
    } catch {
        next(error);
    }
}