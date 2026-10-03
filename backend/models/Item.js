const mongoose = require("mongoose");


const itemSchema = new mongoose.Schema(
    {

        // ==========================================
        // OWNER
        // ==========================================

        owner: {

            type:
                mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true

        },


        // ==========================================
        // ITEM NAME
        // ==========================================

        itemName: {

            type: String,

            required: [
                true,
                "Please enter item name"
            ],

            trim: true,

            maxlength: [
                100,
                "Item name cannot exceed 100 characters"
            ]

        },


        // ==========================================
        // CATEGORY
        // ==========================================

        category: {

            type: String,

            required: [
                true,
                "Please select category"
            ],

            enum: [

                "shirt",

                "tshirt",

                "jeans",

                "jacket",

                "dress",

                "hoodie",

                "shoes",

                "cap",

                "top",

                "other"

            ]

        },


        // ==========================================
        // SIZE
        // ==========================================

        size: {

            type: String,

            required: [
                true,
                "Please select size"
            ],

            enum: [

                "XS",

                "S",

                "M",

                "L",

                "XL",

                "XXL",

                "Free Size"

            ]

        },


        // ==========================================
        // CONDITION
        // ==========================================

        condition: {

            type: String,

            required: [
                true,
                "Please select condition"
            ],

            enum: [

                "New",

                "Like New",

                "Good",

                "Excellent",

                "Used"

            ]

        },


        // ==========================================
        // BRAND
        // ==========================================

        brand: {

            type: String,

            default: "",

            trim: true

        },


        // ==========================================
        // DESCRIPTION
        // ==========================================

        description: {

            type: String,

            default: "",

            trim: true,

            maxlength: [
                1000,
                "Description cannot exceed 1000 characters"
            ]

        },


        // ==========================================
        // LOCATION
        // ==========================================

        location: {

            type: String,

            required: [
                true,
                "Please enter location"
            ],

            trim: true

        },


        // ==========================================
        // PRICE
        // ==========================================

        price: {

            type: Number,

            default: null,

            min: [
                0,
                "Price cannot be negative"
            ]

        },


        // ==========================================
        // AVAILABLE FOR
        // ==========================================

        availableFor: {

            type: String,

            enum: [

                "Swap",

                "Sell",

                "Both"

            ],

            default: "Swap",

            required: true

        },


        // ==========================================
        // PICKUP LOCATION
        // ==========================================

        pickupLocation: {

            type: String,

            default: "",

            trim: true

        },


        // ==========================================
        // MULTIPLE IMAGES
        // Maximum 6 images
        // ==========================================

        images: {

            type: [

                {

                    type: String,

                    trim: true

                }

            ],

            default: [],

            validate: {

                validator: function (value) {

                    return value.length <= 6;

                },

                message:
                    "You can add maximum 6 images"

            }

        },


        // ==========================================
        // OLD IMAGE FIELD
        // Kept for old records
        // ==========================================

        image: {

            type: String,

            default: "",

            trim: true

        },


        // ==========================================
        // STATUS
        // ==========================================

        status: {

            type: String,

            enum: [

                "available",

                "pending",

                "swapped"

            ],

            default: "available"

        }

    },

    {

        timestamps: true

    }

);


// ==========================================
// EXPORT MODEL
// ==========================================

module.exports = mongoose.model(
    "Item",
    itemSchema
);