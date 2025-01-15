import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,

    }
    // timestamps are used to track when the document was created and last updated
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;