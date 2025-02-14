import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    bathrooms: {
        type: Number,
        required: true,
    },
    bedrooms: {
        type: Number,
        required: true,
    },
    furnished: {
        type: Boolean,
        required: true,
    },
    parking: {
        type: Boolean,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['sale', 'rent'],
    },
    imageUrls: {
        type: Array,
        required: true,
    },
    userRef: {
        type: String,
        required: true,
    },
    latitute: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    property: {
        type: String,
        required: true,
        enum: ['apartment', 'house', 'condo', 'townhouse'],
    },
}, { timestamps: true });

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;
