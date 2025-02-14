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

    },
    avatar: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },
    savedListing: {
        type: [mongoose.Schema.Types.ObjectId], // or String, depending on your structure
        default: []
      }

    // timestamps are used to track when the document was created and last updated
}, {timestamps: true});

// create a model from the schema
const User = mongoose.model('User', userSchema);

export default User;