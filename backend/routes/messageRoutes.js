
const express = require("express");
const mongoose = require("mongoose");

const Message = require("../models/Message");
const User = require("../models/User");

const router = express.Router();

// ==================================================
// HELPERS
// ==================================================

function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
}

function getUserIdFromBody(id) {
    if (!id) return "";

    if (typeof id === "object") {
        return String(id._id || id.id || "").trim();
    }

    return String(id).trim();
}

async function findUserByIdOrEmail(id, email) {
    let user = null;
    const cleanId = getUserIdFromBody(id);
    const cleanEmail = normalizeEmail(email);

    // Try MongoDB ObjectId first
    if (cleanId && mongoose.Types.ObjectId.isValid(cleanId)) {
        user = await User.findById(cleanId);
    }

    // Fallback to email lookup
    if (!user && cleanEmail) {
        user = await User.findOne({
            email: {
                $regex: new RegExp(
                    "^" +
                    cleanEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
                    "$",
                    "i"
                )
            }
        });
    }

    return user;
}

// ==================================================
// SEND MESSAGE
// POST /api/messages
// ==================================================

router.post("/", async (req, res) => {
    try {
        const {
            sender,
            receiver,
            senderEmail,
            receiverEmail,
            message
        } = req.body;

        if (
            typeof message !== "string" ||
            !message.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Message cannot be empty."
            });
        }

        if (message.trim().length > 1000) {
            return res.status(400).json({
                success: false,
                message: "Message cannot exceed 1000 characters."
            });
        }

        // Find sender and receiver using ID or email
        const senderUser = await findUserByIdOrEmail(
            sender,
            senderEmail
        );

        if (!senderUser) {
            console.error("Sender lookup failed:", {
                senderIdProvided: Boolean(sender),
                senderEmailProvided: Boolean(senderEmail)
            });

            return res.status(404).json({
                success: false,
                message: "Sender not found. Please login again."
            });
        }

        const receiverUser = await findUserByIdOrEmail(
            receiver,
            receiverEmail
        );

        if (!receiverUser) {
            return res.status(404).json({
                success: false,
                message: "Receiver not found."
            });
        }

        if (
            String(senderUser._id) ===
            String(receiverUser._id)
        ) {
            return res.status(400).json({
                success: false,
                message: "You cannot message yourself."
            });
        }

        const newMessage = await Message.create({
            sender: senderUser._id,
            receiver: receiverUser._id,
            message: message.trim()
        });

        const populatedMessage = await Message.findById(
            newMessage._id
        )
            .populate("sender", "name email")
            .populate("receiver", "name email");

        return res.status(201).json({
            success: true,
            message: "Message sent successfully.",
            data: populatedMessage
        });

    } catch (error) {
        console.error("Send Message Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to send message.",
            error: error.message
        });
    }
});

// ==================================================
// GET ALL MESSAGES OF USER BY EMAIL
// GET /api/messages/:email
// ==================================================

router.get("/:email", async (req, res) => {
    try {
        const email = normalizeEmail(req.params.email);

        const user = await User.findOne({
            email: {
                $regex: new RegExp(
                    "^" +
                    email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
                    "$",
                    "i"
                )
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const messages = await Message.find({
            $or: [
                { sender: user._id },
                { receiver: user._id }
            ]
        })
            .populate("sender", "name email")
            .populate("receiver", "name email")
            .sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            count: messages.length,
            messages
        });

    } catch (error) {
        console.error("Get User Messages Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch user messages.",
            error: error.message
        });
    }
});

// ==================================================
// GET CONVERSATION
// GET /api/messages/conversation/:userId/:otherUserId
// ==================================================

router.get(
    "/conversation/:userId/:otherUserId",
    async (req, res) => {
        try {
            const { userId, otherUserId } = req.params;

            if (
                !mongoose.Types.ObjectId.isValid(userId) ||
                !mongoose.Types.ObjectId.isValid(otherUserId)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid user ID."
                });
            }

            const messages = await Message.find({
                $or: [
                    {
                        sender: userId,
                        receiver: otherUserId
                    },
                    {
                        sender: otherUserId,
                        receiver: userId
                    }
                ]
            })
                .populate("sender", "name email")
                .populate("receiver", "name email")
                .sort({ createdAt: 1 });

            return res.status(200).json({
                success: true,
                count: messages.length,
                messages
            });

        } catch (error) {
            console.error("Get Conversation Error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch conversation.",
                error: error.message
            });
        }
    }
);

// ==================================================
// GET RECEIVED MESSAGES
// GET /api/messages/received/:userId
// ==================================================

router.get("/received/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID."
            });
        }

        const messages = await Message.find({
            receiver: userId
        })
            .populate("sender", "name email")
            .populate("receiver", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: messages.length,
            messages
        });

    } catch (error) {
        console.error("Received Messages Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch received messages.",
            error: error.message
        });
    }
});

// ==================================================
// GET SENT MESSAGES
// GET /api/messages/sent/:userId
// ==================================================

router.get("/sent/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID."
            });
        }

        const messages = await Message.find({
            sender: userId
        })
            .populate("sender", "name email")
            .populate("receiver", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: messages.length,
            messages
        });

    } catch (error) {
        console.error("Sent Messages Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch sent messages.",
            error: error.message
        });
    }
});

// ==================================================
// MARK MESSAGE AS READ
// PATCH /api/messages/:id/read
// ==================================================

router.patch("/:id/read", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid message ID."
            });
        }

        const message = await Message.findByIdAndUpdate(
            id,
            { read: true },
            { new: true, runValidators: true }
        )
            .populate("sender", "name email")
            .populate("receiver", "name email");

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Message marked as read.",
            data: message
        });

    } catch (error) {
        console.error("Mark Read Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to mark message as read.",
            error: error.message
        });
    }
});

// ==================================================
// DELETE MESSAGE
// DELETE /api/messages/:id
// ==================================================

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid message ID."
            });
        }

        const message = await Message.findByIdAndDelete(id);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Message deleted successfully."
        });

    } catch (error) {
        console.error("Delete Message Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete message.",
            error: error.message
        });
    }
});

// ==================================================
// EXPORT ROUTER
// ==================================================

module.exports = router;
