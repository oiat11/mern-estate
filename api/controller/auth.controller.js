import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

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