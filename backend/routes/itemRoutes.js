const express = require("express");

const router = express.Router();

const Item =
    require("../models/Item");


// ==================================================
// ADD NEW CLOTHING ITEM
// POST /api/items
// ==================================================

router.post(
    "/",
    async (req, res) => {

        try {

            console.log(
                "\n================================="
            );

            console.log(
                "ADD ITEM REQUEST"
            );

            console.log(
                "BODY:",
                req.body
            );

            console.log(
                "=================================\n"
            );


            const {

                owner,

                itemName,

                category,

                size,

                condition,

                description,

                location,

                image,

                images,

                // ==========================
                // NEW FIELDS
                // ==========================

                price,

                availableFor,

                pickupLocation

            } = req.body;


            // ==========================================
            // VALIDATE REQUIRED FIELDS
            // ==========================================

            if (
                !owner ||
                !itemName ||
                !category ||
                !size ||
                !condition ||
                !location ||
                !availableFor ||
                !pickupLocation
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Please fill all required fields"

                });

            }


            // ==========================================
            // VALIDATE PRICE
            // ==========================================

            if (
                availableFor !== "Swap" &&
                (
                    price === "" ||
                    price === undefined ||
                    price === null ||
                    Number(price) <= 0
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Please enter a valid price."

                });

            }


            // ==========================================
            // VALIDATE AVAILABLE FOR
            // ==========================================

            if (
                ![
                    "Swap",
                    "Sell",
                    "Both"
                ].includes(
                    availableFor
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid availability option."

                });

            }


            // ==========================================
            // PREPARE IMAGES
            // ==========================================

            let finalImages = [];


            if (
                Array.isArray(images)
            ) {

                finalImages =
                    images
                        .map(
                            function (img) {

                                return String(
                                    img
                                ).trim();

                            }
                        )
                        .filter(Boolean);

            }


            // ==========================================
            // OLD IMAGE SUPPORT
            // ==========================================

            if (
                finalImages.length === 0 &&
                image
            ) {

                finalImages = [

                    String(image).trim()

                ];

            }


            // ==========================================
            // MAX 6 IMAGES
            // ==========================================

            finalImages =
                finalImages.slice(
                    0,
                    6
                );


            // ==========================================
            // CREATE ITEM
            // ==========================================

            const item =
                await Item.create({

                    owner:

                        owner,


                    itemName:

                        itemName.trim(),


                    category:

                        category,


                    size:

                        size,


                    condition:

                        condition,


                    description:

                        description
                            ? description.trim()
                            : "",


                    location:

                        location.trim(),


                    // ==================================
                    // PRICE
                    // ==================================

                    price:

                        price === "" ||
                        price === undefined ||
                        price === null

                            ? null

                            : Number(price),


                    // ==================================
                    // AVAILABLE FOR
                    // ==================================

                    availableFor:

                        availableFor,


                    // ==================================
                    // PICKUP LOCATION
                    // ==================================

                    pickupLocation:

                        pickupLocation.trim(),


                    // ==================================
                    // IMAGES
                    // ==================================

                    images:

                        finalImages,


                    image:

                        finalImages.length > 0

                            ? finalImages[0]

                            : "",


                    status:

                        "available"

                });


            // ==========================================
            // POPULATE OWNER
            // ==========================================

            await item.populate(
                "owner",
                "name email phone location"
            );


            // ==========================================
            // SUCCESS
            // ==========================================

            console.log(
                "ITEM CREATED:",
                item._id
            );


            return res.status(201).json({

                success: true,

                message:
                    "Clothing item added successfully",

                item

            });

        }


        catch (error) {

            console.error(
                "Add Item Error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to add clothing item",

                error:
                    error.message

            });

        }

    }
);


// ==================================================
// GET ALL CLOTHING ITEMS
// GET /api/items
// ==================================================

router.get(
    "/",
    async (req, res) => {

        try {

            const items =
                await Item.find({

                    status: {

                        $ne:
                            "swapped"

                    }

                })
                .populate(
                    "owner",
                    "name email phone location"
                )
                .sort({
                    createdAt: -1
                });


            return res.status(200).json({

                success: true,

                count:
                    items.length,

                items

            });

        }

        catch (error) {

            console.error(
                "Get Items Error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to fetch clothing items",

                error:
                    error.message

            });

        }

    }
);


// ==================================================
// GET SINGLE ITEM
// GET /api/items/:id
// ==================================================

router.get(
    "/:id",
    async (req, res) => {

        try {

            const item =
                await Item.findById(
                    req.params.id
                )
                .populate(
                    "owner",
                    "name email phone location"
                );


            if (!item) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Clothing item not found"

                });

            }


            return res.status(200).json({

                success: true,

                item

            });

        }

        catch (error) {

            console.error(
                "Get Single Item Error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to fetch clothing item",

                error:
                    error.message

            });

        }

    }
);


// ==================================================
// GET ITEMS OF PARTICULAR USER
// GET /api/items/user/:userId
// ==================================================

router.get(
    "/user/:userId",
    async (req, res) => {

        try {

            const items =
                await Item.find({

                    owner:
                        req.params.userId

                })
                .sort({
                    createdAt: -1
                });


            return res.status(200).json({

                success: true,

                count:
                    items.length,

                items

            });

        }

        catch (error) {

            console.error(
                "User Items Error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to fetch user's items",

                error:
                    error.message

            });

        }

    }
);


// ==================================================
// UPDATE ITEM
// PUT /api/items/:id
// ==================================================

router.put(
    "/:id",
    async (req, res) => {

        try {

            const {

                itemName,

                category,

                size,

                condition,

                description,

                location,

                image,

                images,

                status,

                // NEW
                price,

                availableFor,

                pickupLocation

            } = req.body;


            const updateData = {};


            if (itemName) {

                updateData.itemName =
                    itemName.trim();

            }


            if (category) {

                updateData.category =
                    category;

            }


            if (size) {

                updateData.size =
                    size;

            }


            if (condition) {

                updateData.condition =
                    condition;

            }


            if (
                description !== undefined
            ) {

                updateData.description =
                    description.trim();

            }


            if (location) {

                updateData.location =
                    location.trim();

            }


            // ==========================================
            // PRICE
            // ==========================================

            if (
                price !== undefined
            ) {

                updateData.price =
                    price === "" ||
                    price === null

                        ? null

                        : Number(price);

            }


            // ==========================================
            // AVAILABLE FOR
            // ==========================================

            if (
                availableFor !== undefined
            ) {

                if (
                    ![
                        "Swap",
                        "Sell",
                        "Both"
                    ].includes(
                        availableFor
                    )
                ) {

                    return res.status(400).json({

                        success: false,

                        message:
                            "Invalid availability option."

                    });

                }


                updateData.availableFor =
                    availableFor;

            }


            // ==========================================
            // PICKUP LOCATION
            // ==========================================

            if (
                pickupLocation !== undefined
            ) {

                updateData.pickupLocation =
                    pickupLocation.trim();

            }


            // ==========================================
            // UPDATE IMAGES
            // ==========================================

            if (
                Array.isArray(images)
            ) {

                const cleanImages =
                    images
                        .map(
                            function (img) {

                                return String(
                                    img
                                ).trim();

                            }
                        )
                        .filter(Boolean)
                        .slice(
                            0,
                            6
                        );


                updateData.images =
                    cleanImages;


                updateData.image =
                    cleanImages.length > 0

                        ? cleanImages[0]

                        : "";

            }

            else if (
                image !== undefined
            ) {

                updateData.image =
                    image;


                updateData.images =
                    image
                        ? [image]
                        : [];

            }


            if (status) {

                updateData.status =
                    status;

            }


            // ==========================================
            // UPDATE DATABASE
            // ==========================================

            const item =
                await Item.findByIdAndUpdate(

                    req.params.id,

                    updateData,

                    {
                        new: true,

                        runValidators: true
                    }

                );


            if (!item) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Clothing item not found"

                });

            }


            return res.status(200).json({

                success: true,

                message:
                    "Clothing item updated successfully",

                item

            });

        }

        catch (error) {

            console.error(
                "Update Item Error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to update clothing item",

                error:
                    error.message

            });

        }

    }
);


// ==================================================
// DELETE ITEM
// DELETE /api/items/:id
// ==================================================

router.delete(
    "/:id",
    async (req, res) => {

        try {

            const item =
                await Item.findByIdAndDelete(
                    req.params.id
                );


            if (!item) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Clothing item not found"

                });

            }


            return res.status(200).json({

                success: true,

                message:
                    "Clothing item deleted successfully"

            });

        }

        catch (error) {

            console.error(
                "Delete Item Error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to delete clothing item",

                error:
                    error.message

            });

        }

    }
);


module.exports = router;