import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {errorHandler} from "../utils/error.js";


export const test = (req, res) => {
    res.json({message: 'Hello World!'});
};

export const updateUser = async (req, res, next) => {
    // check the user id in the request object and compare it with the id in the params
    if (req.user.id !== req.params.id) 
        return next(errorHandler(401, 'Not Authorized to update this user'))
    try {
        // if the password is present in the request body, hash it before saving it to the database
        if (req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, 10);
        }
        // find the user by id and update the user with the new data
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set:{
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
            // set new to true to return the updated user
        }, {new: true});

        const {password, ...others} = updatedUser._doc;

        res.status(200).json(others);
    } catch (err) {
        next(err);
    }
};

export const deleteUser = async (req, res, next) => {
    console.log(req.user.id, req.params.id);
    if (req.user.id !== req.params.id) 
        return next(errorHandler(401, 'Not Authorized to delete this user'))
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json('User has been deleted');
    } catch (err) {
        next(err);
    }
}