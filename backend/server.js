const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// ==========================================
// LOAD ENVIRONMENT VARIABLES
// ==========================================

dotenv.config();


// ==========================================
// CREATE EXPRESS APP
// ==========================================

const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// ==========================================
// STATIC IMAGES
// ==========================================

// Main images folder
app.use(
    "/images",
    express.static(
        path.join(__dirname, "../images")
    )
);


// Uploaded images folder
app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);


// ==========================================
// DATABASE CONNECTION
// ==========================================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {

        console.log(
            "MongoDB connected successfully"
        );

    })
    .catch((error) => {

        console.error(
            "MongoDB connection failed:"
        );

        console.error(
            error.message
        );

    });


// ==========================================
// TEST ROUTE
// ==========================================

app.get(
    "/api/test",
    (req, res) => {
        console.log("API TEST ROUTE HIT");

        res.status(200).json({

            success: true,

            message:
                "SwapWear Backend API is working!"

        });

    }
);


// ==========================================
// HOME ROUTE
// ==========================================

app.get(
    "/",
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "../index.html"
            )
        );

    }
);


// ==========================================
// LOAD ROUTERS
// ==========================================

let authRoutes;
let itemRoutes;
let swapRoutes;
let messageRoutes;


// ==========================================
// AUTH ROUTES
// ==========================================

try {

    const authModule =
        require("./routes/authRoutes");

    /*
       Supports:
       module.exports = router

       OR

       module.exports = { router }
    */

    authRoutes =
        authModule.router ||
        authModule.authRoutes ||
        authModule.default ||
        authModule;

    console.log(
        "AUTH ROUTES TYPE:",
        typeof authRoutes
    );

} catch (error) {

    console.error(
        "AUTH ROUTES ERROR:",
        error.message
    );

}


// ==========================================
// ITEM ROUTES
// ==========================================

try {

    itemRoutes =
        require("./routes/itemRoutes");

    console.log(
        "ITEM ROUTES TYPE:",
        typeof itemRoutes
    );

} catch (error) {

    console.error(
        "ITEM ROUTES ERROR:",
        error.message
    );

}


// ==========================================
// SWAP ROUTES
// ==========================================

try {

    swapRoutes =
        require("./routes/swapRoutes");

    console.log(
        "SWAP ROUTES TYPE:",
        typeof swapRoutes
    );

} catch (error) {

    console.error(
        "SWAP ROUTES ERROR:",
        error.message
    );

}


// ==========================================
// MESSAGE ROUTES
// ==========================================

try {

    messageRoutes =
        require("./routes/messageRoutes");

    console.log(
        "MESSAGE ROUTES TYPE:",
        typeof messageRoutes
    );

} catch (error) {

    console.error(
        "MESSAGE ROUTES ERROR:",
        error.message
    );

}


// ==========================================
// MOUNT AUTH ROUTES
// ==========================================

if (
    typeof authRoutes === "function"
) {

    app.use(
        "/api/auth",
        authRoutes
    );

    console.log(
        "AUTH ROUTES MOUNTED: /api/auth"
    );

} else {

    console.error(
        "ERROR: authRoutes is not an Express router."
    );

}


// ==========================================
// MOUNT ITEM ROUTES
// ==========================================

if (
    typeof itemRoutes === "function"
) {

    app.use(
        "/api/items",
        itemRoutes
    );

    console.log(
        "ITEM ROUTES MOUNTED: /api/items"
    );

} else {

    console.error(
        "ERROR: itemRoutes is not an Express router."
    );

}


// ==========================================
// MOUNT SWAP REQUEST ROUTES
// ==========================================

if (
    typeof swapRoutes === "function"
) {

    app.use(
        "/api/swap-requests",
        swapRoutes
    );

    console.log(
        "SWAP ROUTES MOUNTED: /api/swap-requests"
    );

} else {

    console.error(
        "ERROR: swapRoutes is not an Express router."
    );

}


// ==========================================
// MOUNT MESSAGE ROUTES
// ==========================================

if (
    typeof messageRoutes === "function"
) {

    app.use(
        "/api/messages",
        messageRoutes
    );

    console.log(
        "MESSAGE ROUTES MOUNTED: /api/messages"
    );

} else {

    console.error(
        "ERROR: messageRoutes is not an Express router."
    );

}


// ==========================================
// API 404 ROUTE
// ==========================================

app.use(
    "/api",
    (req, res) => {

        res.status(404).json({

            success: false,

            message:
                "API route not found"

        });

    }
);


// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use(
    (err, req, res, next) => {

        console.error(
            "================================="
        );

        console.error(
            "SERVER ERROR:"
        );

        console.error(
            err
        );

        console.error(
            "================================="
        );

        res.status(500).json({

            success: false,

            message:
                "Internal Server Error",

            error:
                err.message

        });

    }
);


// ==========================================
// START SERVER
// ==========================================

const PORT =
    process.env.PORT || 5000;


app.listen(
    PORT,
    () => {

        console.log(
            "================================="
        );

        console.log(
            "SwapWear Server Started"
        );

        console.log(
            `http://localhost:${PORT}`
        );

        console.log(
            "================================="
        );

    }
);