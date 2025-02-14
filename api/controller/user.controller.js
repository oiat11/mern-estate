import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";
import bcrypt from "bcryptjs";
import {errorHandler} from "../utils/error.js";


export const test = (req, res) => {
    res.json({message: 'Hello World!'});
};

export const updateUser = async (req, res, next) => {
    // Check if the authenticated user is the same as the user being updated
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(401, 'Not Authorized to update this user'));
    }

    try {
        // If password is provided, hash it before updating
        if (req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, 10);
        }

        // Update user information
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,  // Ensure this matches the route parameter
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    avatar: req.body.avatar,
                },
            },
            { new: true } // Return the updated user document
        );

        if (!updatedUser) {
            return next(errorHandler(404, 'User not found'));
        }

        const { password, ...others } = updatedUser._doc;

        res.status(200).json(others);
    } catch (err) {
        next(err);
    }
};


export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(401, 'Not Authorized to delete this user'));
    }
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.clearCookie('access_token');
        res.status(200).json({ message: 'User has been deleted' }); // JSON format
    } catch (err) {
        next(err);
    }
};


export const getUserListings = async (req, res, next) => {
    if (req.user.id === req.params.userId) {
      try {
        const listings = await Listing.find({ userRef: req.params.userId });
        res.status(200).json(listings);
      } catch (error) {
        next(error);
      }
    } else {
      return next(errorHandler(401, 'You can only view your own listings!'));
    }
  };

  export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId); 
        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }
        const { password: pass, ...others } = user._doc;
        return res.status(200).json(others);
    } catch (error) {
        next(error);
    }
};


  export const addSavedListing = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id); // Corrected
        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }
        // Check if listing is already saved
        if (user.savedListing.includes(req.params.listingId)) {
            return next(errorHandler(400, 'Listing already saved'));
        }
        // Add listing to savedListing array
        user.savedListing.push(req.params.listingId);
        await user.save();
        res.status(200).json('Listing has been saved');
    } catch (error) {
        next(error);
    }
};

export const removeSavedListing = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id); // Corrected
        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }
        // Remove listing from savedListing array
        user.savedListing = user.savedListing.filter(id => id.toString() !== req.params.listingId);
        await user.save();
        res.status(200).json('Listing has been removed');
    } catch (error) {
        next(error);
    }
};
