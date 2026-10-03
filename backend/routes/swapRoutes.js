const express = require("express");

const router = express.Router();

const SwapRequest =
    require("../models/SwapRequest");



// =========================================================
// GET SWAP REQUESTS FOR A USER
// =========================================================

router.get("/:email", async (req, res) => {

    try {

        const email =
            decodeURIComponent(
                req.params.email
            )
            .trim()
            .toLowerCase();


        console.log(
            "================================="
        );

        console.log(
            "GET SWAP REQUESTS"
        );

        console.log(
            "EMAIL:",
            email
        );

        console.log(
            "================================="
        );


        if (!email) {

            return res.status(400).json({

                success: false,

                message:
                    "Email is required.",

                requests: []

            });

        }


        // =================================================
        // FIND REQUESTS
        // =================================================

        const requests =
            await SwapRequest.find({

                $or: [

                    {
                        requesterEmail:
                            email
                    },

                    {
                        ownerEmail:
                            email
                    }

                ]

            })
            .sort({
                createdAt: -1
            });


        console.log(
            "SWAP REQUESTS FOUND:",
            requests.length
        );


        return res.status(200).json({

            success: true,

            count:
                requests.length,

            requests:
                requests

        });

    }

    catch (error) {

        console.error(
            "GET SWAP REQUEST ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch swap requests.",

            error:
                error.message,

            requests: []

        });

    }

});



// =====================================================
// SEND SWAP REQUEST
// =====================================================

router.post("/", async (req, res) => {

    try {

        console.log(
            "\n===================================="
        );

        console.log(
            "SWAP REQUEST RECEIVED"
        );

        console.log(
            "BODY:"
        );

        console.log(
            req.body
        );

        console.log(
            "===================================="
        );


        const {

            item,

            requester,

            requesterName,

            requesterEmail,

            owner,

            ownerEmail,

            ownerName,

            productName,

            offeredItem,

            status,

            message

        } = req.body;



        // =================================================
        // VALIDATION
        // =================================================

        if (!item) {

            return res.status(400).json({

                success: false,

                message:
                    "Item is required"

            });

        }


        if (!requesterEmail) {

            return res.status(400).json({

                success: false,

                message:
                    "Requester email is required"

            });

        }


        const cleanRequesterEmail =
            requesterEmail
                .trim()
                .toLowerCase();


        const cleanOwnerEmail =
            ownerEmail
                ? ownerEmail
                    .trim()
                    .toLowerCase()
                : "";


        console.log(
            "Requester Email:",
            cleanRequesterEmail
        );


        console.log(
            "Owner Email:",
            cleanOwnerEmail
        );



        // =================================================
        // PREVENT OWN ITEM SWAP
        // =================================================

        if (

            cleanOwnerEmail &&

            cleanRequesterEmail ===
                cleanOwnerEmail

        ) {

            return res.status(400).json({

                success: false,

                message:
                    "You cannot send a swap request for your own item."

            });

        }



        // =================================================
        // CREATE REQUEST
        // =================================================

        const newRequest =
            new SwapRequest({

                item:
                    item,


                requester:
                    requester ||
                    cleanRequesterEmail,


                requesterName:
                    requesterName ||
                    "User",


                requesterEmail:
                    cleanRequesterEmail,


                owner:
                    owner ||
                    cleanOwnerEmail,


                ownerEmail:
                    cleanOwnerEmail,


                ownerName:
                    ownerName ||
                    "",


                productName:
                    productName ||
                    item.productName ||
                    item.name ||
                    "Clothing Item",


                offeredItem:
                    offeredItem ||
                    null,


                status:
                    status ||
                    "pending",


                message:
                    message ||
                    ""

            });



        // =================================================
        // SAVE TO MONGODB
        // =================================================

        const savedRequest =
            await newRequest.save();


        console.log(
            "\n===================================="
        );


        console.log(
            "SWAP REQUEST CREATED SUCCESSFULLY"
        );


        console.log(
            "REQUEST ID:",
            savedRequest._id
        );


        console.log(
            "REQUESTER:",
            cleanRequesterEmail
        );


        console.log(
            "OWNER:",
            cleanOwnerEmail
        );


        console.log(
            "PRODUCT:",
            savedRequest.productName
        );


        console.log(
            "STATUS:",
            savedRequest.status
        );


        console.log(
            "====================================\n"
        );



        // =================================================
        // RESPONSE
        // =================================================

        return res.status(201).json({

            success: true,

            message:
                "Swap request sent successfully!",

            data:
                savedRequest

        });

    }

    catch (error) {

        console.error(
            "SWAP REQUEST ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to send swap request",

            error:
                error.message

        });

    }

});



// =====================================================
// UPDATE SWAP REQUEST STATUS
// ACCEPT / REJECT
//
// IMPORTANT:
// This route MUST be OUTSIDE router.post()
// =====================================================

router.put(
    "/:id/status",
    async (req, res) => {

        try {

            const {
                id
            } = req.params;


            const {
                status
            } = req.body;


            console.log(
                "\n================================="
            );


            console.log(
                "UPDATE SWAP REQUEST"
            );


            console.log(
                "REQUEST ID:",
                id
            );


            console.log(
                "NEW STATUS:",
                status
            );


            console.log(
                "================================="
            );



            // =============================================
            // VALIDATE STATUS
            // =============================================

            if (

                ![
                    "accepted",
                    "rejected",
                    "pending"
                ]
                .includes(status)

            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid status"

                });

            }



            // =============================================
            // FIND REQUEST
            // =============================================

            const request =
                await SwapRequest.findById(id);


            if (!request) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Swap request not found"

                });

            }



            // =============================================
            // UPDATE STATUS
            // =============================================

            request.status =
                status;


            await request.save();



            console.log(
                "STATUS UPDATED:",
                request.status
            );


            console.log(
                "REQUEST ID:",
                request._id
            );



            // =============================================
            // RESPONSE
            // =============================================

            return res.status(200).json({

                success: true,

                message:
                    `Swap request ${status} successfully`,

                request:
                    request

            });

        }

        catch (error) {

            console.error(
                "UPDATE STATUS ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to update swap request",

                error:
                    error.message

            });

        }

    }
);



// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;