const mongoose = require("mongoose");

// ==================================================
// MESSAGE SCHEMA
// ==================================================

const messageSchema = new mongoose.Schema(
    {
        // ==========================================
        // SENDER
        // ==========================================

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },


        // ==========================================
        // RECEIVER
        // ==========================================

        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },


        // ==========================================
        // MESSAGE
        // ==========================================

        message: {
            type: String,
            required: [
                true,
                "Message is required"
            ],
            trim: true,
            maxlength: [
                1000,
                "Message cannot exceed 1000 characters"
            ]
        },


        // ==========================================
        // READ STATUS
        // ==========================================

        read: {
            type: Boolean,
            default: false
        }
    },

    {
        timestamps: true
    }
);


// ==================================================
// EXPORT MESSAGE MODEL
// ==================================================

module.exports = mongoose.model(
    "Message",
    messageSchema
);