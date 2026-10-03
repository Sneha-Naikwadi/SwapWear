const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter your name"],
            trim: true,
            maxlength: [50, "Name cannot exceed 50 characters"]
        },

        email: {
            type: String,
            required: [true, "Please enter your email"],
            unique: true,
            lowercase: true,
            trim: true
        },

        phone: {
            type: String,
            required: [true, "Please enter your phone number"],
            trim: true
        },

        location: {
            type: String,
            required: [true, "Please enter your location"],
            trim: true
        },

        password: {
            type: String,
            required: [true, "Please enter your password"],
            minlength: [6, "Password must be at least 6 characters"]
        },

        profileImage: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);