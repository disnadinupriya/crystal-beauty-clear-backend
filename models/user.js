import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    rol: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },

    phone: {
        type: String,
        required: true,
        default: "not Given"
    },

    isDisabled: {
        type: Boolean,
        required: true,
        default: false
    },

    isMailVerified: {
        type: Boolean,
        required: true,
        default: false
    },

});

const userModel = mongoose.model("User", userSchema);

export default userModel;
