import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import {errorHandler} from "../utils/error.js";
import jwt from "jsonwebtoken";

// signup controller to create a new user in the database
// use bcryptjs to hash the password before saving it to the database
export const signup = async(req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    try {
        await newUser.save()
        res.status(201).json("User created successfully" );
    } catch (error) {
        next(error);
    }

};

export const signin = async(req, res, next) => {
    const { email, password } = req.body;

    try {
        // check if the email is correct in the database
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, "User not found"));

        // check if the password is correct with bcryptjs
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, "Wrong credentials"));

        // create a token with jwt and send it to the client
        // destruct the password from the user object so it is not sent to the client
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET)
        const { password: pass, ...rest } = validUser._doc;

        // send the token and the user data to the client
        res.cookie("access_token", token, { httpOnly: true }).status(200).json(rest);
    } catch (error) {
        next(error);
    }

}