const express = require("express");

const Message = require("../models/Message");
const User = require("../models/User");

const router = express.Router();


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


        // ==========================================
        // VALIDATE MESSAGE
        // ==========================================

        if (!message || !message.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "Message cannot be empty"

            });

        }


        // ==========================================
        // FIND SENDER
        // ==========================================

        let senderUser = null;


        // First try sender ID
        if (sender) {

            try {

                senderUser =
                    await User.findById(sender);

            } catch (error) {

                console.log(
                    "Sender ID lookup failed"
                );

            }

        }


        // If ID not found, try sender email
        if (!senderUser && senderEmail) {

            senderUser =
                await User.findOne({

                    email:
                        senderEmail
                            .trim()
                            .toLowerCase()

                });

        }


        // ==========================================
        // CHECK SENDER
        // ==========================================

        if (!senderUser) {

            return res.status(404).json({

                success: false,

                message:
                    "Sender not found"

            });

        }


        // ==========================================
        // FIND RECEIVER
        // ==========================================

        let receiverUser = null;


        // First try receiver ID
        if (receiver) {

            try {

                receiverUser =
                    await User.findById(receiver);

            } catch (error) {

                console.log(
                    "Receiver ID lookup failed"
                );

            }

        }


        // If ID not found, try receiver email
        if (!receiverUser && receiverEmail) {

            receiverUser =
                await User.findOne({

                    email:
                        receiverEmail
                            .trim()
                            .toLowerCase()

                });

        }


        // ==========================================
        // CHECK RECEIVER
        // ==========================================

        if (!receiverUser) {

            return res.status(404).json({

                success: false,

                message:
                    "Receiver not found"

            });

        }


        // ==========================================
        // CREATE MESSAGE
        // ==========================================

        const newMessage =
            await Message.create({

                sender:
                    senderUser._id,

                receiver:
                    receiverUser._id,

                message:
                    message.trim()

            });


        // ==========================================
        // POPULATE MESSAGE
        // ==========================================

        const populatedMessage =
            await Message.findById(
                newMessage._id
            )
                .populate(
                    "sender",
                    "name email"
                )
                .populate(
                    "receiver",
                    "name email"
                );


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(201).json({

            success: true,

            message:
                "Message sent successfully",

            data:
                populatedMessage

        });


    } catch (error) {

        console.error(
            "Send Message Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to send message",

            error:
                error.message

        });

    }

});


// ==================================================
// GET ALL MESSAGES OF USER BY EMAIL
// GET /api/messages/:email
// ==================================================

router.get(
    "/:email",
    async (req, res) => {

        try {

            const email =
                req.params.email
                    .trim()
                    .toLowerCase();


            // ======================================
            // FIND USER
            // ======================================

            const user =
                await User.findOne({
                    email: email
                });


            if (!user) {

                return res.status(404).json({

                    success: false,

                    message:
                        "User not found"

                });

            }


            // ======================================
            // FIND USER MESSAGES
            // ======================================

            const messages =
                await Message.find({

                    $or: [

                        {
                            sender:
                                user._id
                        },

                        {
                            receiver:
                                user._id
                        }

                    ]

                })
                    .populate(
                        "sender",
                        "name email"
                    )
                    .populate(
                        "receiver",
                        "name email"
                    )
                    .sort({
                        createdAt: 1
                    });


            // ======================================
            // RESPONSE
            // ======================================

            return res.status(200).json({

                success: true,

                count:
                    messages.length,

                messages:
                    messages

            });


        } catch (error) {

            console.error(
                "Get User Messages Error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to fetch user messages",

                error:
                    error.message

            });

        }

    }
);


// ==================================================
// GET CONVERSATION
// GET /api/messages/conversation/:userId/:otherUserId
// ==================================================

router.get(
    "/conversation/:userId/:otherUserId",
    async (req, res) => {

        try {

            const {
                userId,
                otherUserId
            } = req.params;


            const messages =
                await Message.find({

                    $or: [

                        {
                            sender:
                                userId,

                            receiver:
                                otherUserId
                        },

                        {
                            sender:
                                otherUserId,

                            receiver:
                                userId
                        }

                    ]

                })
                    .populate(
                        "sender",
                        "name email"
                    )
                    .populate(
                        "receiver",
                        "name email"
                    )
                    .sort({
                        createdAt: 1
                    });


            return res.status(200).json({

                success: true,

                count:
                    messages.length,

                messages

            });


        } catch (error) {

            console.error(
                "Get Conversation Error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to fetch conversation",

                error:
                    error.message

            });

        }

    }
);


// ==================================================
// GET RECEIVED MESSAGES
// GET /api/messages/received/:userId
// ==================================================

router.get(
    "/received/:userId",
    async (req, res) => {

        try {

            const messages =
                await Message.find({

                    receiver:
                        req.params.userId

                })
                    .populate(
                        "sender",
                        "name email"
                    )
                    .populate(
                        "receiver",
                        "name email"
                    )
                    .sort({
                        createdAt: -1
                    });


            return res.status(200).json({

                success: true,

                count:
                    messages.length,

                messages

            });


        } catch (error) {

            console.error(
                "Received Messages Error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to fetch received messages",

                error:
                    error.message

            });

        }

    }
);


// ==================================================
// GET SENT MESSAGES
// GET /api/messages/sent/:userId
// ==================================================

router.get(
    "/sent/:userId",
    async (req, res) => {

        try {

            const messages =
                await Message.find({

                    sender:
                        req.params.userId

                })
                    .populate(
                        "sender",
                        "name email"
                    )
                    .populate(
                        "receiver",
                        "name email"
                    )
                    .sort({
                        createdAt: -1
                    });


            return res.status(200).json({

                success: true,

                count:
                    messages.length,

                messages

            });


        } catch (error) {

            console.error(
                "Sent Messages Error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to fetch sent messages",

                error:
                    error.message

            });

        }

    }
);


// ==================================================
// MARK MESSAGE AS READ
// PATCH /api/messages/:id/read
// ==================================================

router.patch(
    "/:id/read",
    async (req, res) => {

        try {

            const message =
                await Message.findByIdAndUpdate(

                    req.params.id,

                    {
                        read: true
                    },

                    {
                        new: true
                    }

                )
                    .populate(
                        "sender",
                        "name email"
                    )
                    .populate(
                        "receiver",
                        "name email"
                    );


            if (!message) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Message not found"

                });

            }


            return res.status(200).json({

                success: true,

                message:
                    "Message marked as read",

                data:
                    message

            });


        } catch (error) {

            console.error(
                "Mark Read Error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to mark message as read",

                error:
                    error.message

            });

        }

    }
);


// ==================================================
// DELETE MESSAGE
// DELETE /api/messages/:id
// ==================================================

router.delete(
    "/:id",
    async (req, res) => {

        try {

            const message =
                await Message.findByIdAndDelete(
                    req.params.id
                );


            if (!message) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Message not found"

                });

            }


            return res.status(200).json({

                success: true,

                message:
                    "Message deleted successfully"

            });


        } catch (error) {

            console.error(
                "Delete Message Error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to delete message",

                error:
                    error.message

            });

        }

    }
);


// ==================================================
// EXPORT ROUTER
// ==================================================

module.exports = router;