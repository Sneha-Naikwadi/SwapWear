const mongoose = require("mongoose");


// ==========================================================
// SWAP REQUEST SCHEMA
// ==========================================================

const swapRequestSchema = new mongoose.Schema(

    {

        // ==================================================
        // Requested clothing item
        // ==================================================

        item: {

            type: mongoose.Schema.Types.Mixed,

            required: true

        },


        // ==================================================
        // Requester EMAIL
        // ==================================================

        requester: {

            type: String,

            default: ""

        },


        // ==================================================
        // Owner EMAIL
        // ==================================================

        owner: {

            type: String,

            default: ""

        },


        // ==================================================
        // Item offered by requester
        // ==================================================

        offeredItem: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Item",

            default: null

        },


        // ==================================================
        // Product name
        // ==================================================

        productName: {

            type: String,

            default: ""

        },


        // ==================================================
        // Requester information
        // ==================================================

        requesterName: {

            type: String,

            default: ""

        },


        requesterEmail: {

            type: String,

            default: ""

        },


        // ==================================================
        // Owner information
        // ==================================================

        ownerName: {

            type: String,

            default: ""

        },


        ownerEmail: {

            type: String,

            default: ""

        },


        // ==================================================
        // Optional message
        // ==================================================

        message: {

            type: String,

            default: ""

        },


        // ==================================================
        // Request status
        // ==================================================

        status: {

            type: String,

            enum: [

                "pending",
                "accepted",
                "rejected",
                "cancelled"

            ],

            default: "pending"

        }

    },

    {

        timestamps: true

    }

);


// ==========================================================
// EXPORT MODEL
// ==========================================================

module.exports =
    mongoose.model(
        "SwapRequest",
        swapRequestSchema
    );