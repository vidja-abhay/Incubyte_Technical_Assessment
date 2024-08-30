import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    user_name: {
        type: String,
        required: true,
        trim: true
    },
    issued_books: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }]
},
    {
        timestamps: true
    }
);

const User = mongoose.model('User', userSchema);

export default User