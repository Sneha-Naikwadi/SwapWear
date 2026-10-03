const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");


// ==================================================
// CREATE EXPRESS ROUTER
// ==================================================

const router = express.Router();


// ==================================================
// SIGNUP
// POST /api/auth/signup
// ==================================================

router.post(
    "/signup",
    async (req, res) => {

        try {

            const {
                name,
                email,
                phone,
                location,
                password
            } = req.body;


            // ------------------------------------------
            // VALIDATE REQUIRED FIELDS
            // ------------------------------------------

            if (
                !name ||
                !email ||
                !phone ||
                !location ||
                !password
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "All fields are required"

                });

            }


            // ------------------------------------------
            // PASSWORD LENGTH
            // ------------------------------------------

            if (password.length < 6) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Password must be at least 6 characters"

                });

            }


            // ------------------------------------------
            // NORMALIZE EMAIL
            // ------------------------------------------

            const userEmail =
                email
                    .trim()
                    .toLowerCase();


            // ------------------------------------------
            // CHECK EXISTING USER
            // ------------------------------------------

            const existingUser =
                await User.findOne({
                    email: userEmail
                });


            if (existingUser) {

                return res.status(409).json({

                    success: false,

                    message:
                        "Email is already registered"

                });

            }


            // ------------------------------------------
            // HASH PASSWORD
            // ------------------------------------------

            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                );


            // ------------------------------------------
            // CREATE USER
            // ------------------------------------------

            const user =
                await User.create({

                    name:
                        name.trim(),

                    email:
                        userEmail,

                    phone:
                        phone.trim(),

                    location:
                        location.trim(),

                    password:
                        hashedPassword

                });


            // ------------------------------------------
            // RESPONSE
            // ------------------------------------------

            return res.status(201).json({

                success: true,

                message:
                    "Account created successfully",

                user: {

                    id:
                        user._id,

                    name:
                        user.name,

                    email:
                        user.email,

                    phone:
                        user.phone,

                    location:
                        user.location

                }

            });

        }

        catch (error) {

            console.error(
                "Signup Error:",
                error
            );


            // Duplicate email
            if (
                error.code === 11000
            ) {

                return res.status(409).json({

                    success: false,

                    message:
                        "Email is already registered"

                });

            }


            return res.status(500).json({

                success: false,

                message:
                    "Signup failed",

                error:
                    error.message

            });

        }

    }
);


// ==================================================
// LOGIN
// POST /api/auth/login
// ==================================================

router.post(
    "/login",
    async (req, res) => {

        try {

            const {
                email,
                password
            } = req.body;


            // ------------------------------------------
            // VALIDATE
            // ------------------------------------------

            if (
                !email ||
                !password
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Email and password are required"

                });

            }


            // ------------------------------------------
            // NORMALIZE EMAIL
            // ------------------------------------------

            const userEmail =
                email
                    .trim()
                    .toLowerCase();


            // ------------------------------------------
            // FIND USER
            // ------------------------------------------

            const user =
                await User.findOne({

                    email:
                        userEmail

                });


            if (!user) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid email or password"

                });

            }


            // ------------------------------------------
            // CHECK PASSWORD
            // ------------------------------------------

            const passwordMatch =
                await bcrypt.compare(
                    password,
                    user.password
                );


            if (!passwordMatch) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid email or password"

                });

            }


            // ------------------------------------------
            // CHECK JWT SECRET
            // ------------------------------------------

            if (
                !process.env.JWT_SECRET
            ) {

                console.error(
                    "JWT_SECRET is missing in .env"
                );


                return res.status(500).json({

                    success: false,

                    message:
                        "Server configuration error"

                });

            }


            // ------------------------------------------
            // CREATE TOKEN
            // ------------------------------------------

            const token =
                jwt.sign(

                    {
                        userId:
                            user._id.toString()
                    },

                    process.env.JWT_SECRET,

                    {
                        expiresIn:
                            "7d"
                    }

                );


            // ------------------------------------------
            // LOGIN RESPONSE
            // ------------------------------------------

            return res.status(200).json({

                success: true,

                message:
                    "Login successful",

                token,

                user: {

                    id:
                        user._id,

                    name:
                        user.name,

                    email:
                        user.email,

                    phone:
                        user.phone,

                    location:
                        user.location,

                    profileImage:
                        user.profileImage

                }

            });

        }

        catch (error) {

            console.error(
                "Login Error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Login failed",

                error:
                    error.message

            });

        }

    }
);


// ==================================================
// GET USER BY ID
// GET /api/auth/user/:id
// ==================================================

router.get(
    "/user/:id",
    async (req, res) => {

        try {

            const user =
                await User.findById(
                    req.params.id
                ).select("-password");


            if (!user) {

                return res.status(404).json({

                    success: false,

                    message:
                        "User not found"

                });

            }


            return res.status(200).json({

                success: true,

                user

            });

        }

        catch (error) {

            console.error(
                "Get User Error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to get user",

                error:
                    error.message

            });

        }

    }
);


// ==================================================
// UPDATE USER PROFILE
// PUT /api/auth/user/:id
// ==================================================

router.put(
    "/user/:id",
    async (req, res) => {

        try {

            const {
                name,
                phone,
                location
            } = req.body;


            const updateData = {};


            if (name) {

                updateData.name =
                    name.trim();

            }


            if (phone) {

                updateData.phone =
                    phone.trim();

            }


            if (location) {

                updateData.location =
                    location.trim();

            }


            const user =
                await User.findByIdAndUpdate(

                    req.params.id,

                    updateData,

                    {
                        new: true,
                        runValidators: true
                    }

                ).select("-password");


            if (!user) {

                return res.status(404).json({

                    success: false,

                    message:
                        "User not found"

                });

            }


            return res.status(200).json({

                success: true,

                message:
                    "Profile updated successfully",

                user

            });

        }

        catch (error) {

            console.error(
                "Update Profile Error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to update profile",

                error:
                    error.message

            });

        }

    }
);


// ==================================================
// GET ALL USERS
// GET /api/auth/users
// ==================================================

router.get(
    "/users",
    async (req, res) => {

        try {

            const users =
                await User.find()

                    .select(
                        "_id name email phone location profileImage"
                    )

                    .sort({
                        name: 1
                    });


            return res.status(200).json({

                success: true,

                count:
                    users.length,

                users

            });

        }

        catch (error) {

            console.error(
                "Get All Users Error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to get users",

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