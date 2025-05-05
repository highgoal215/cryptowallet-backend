const bcrypt = require("bcrypt");
const user = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// signup router handler
exports.signUp = async(req, res) => {
    try {
        const { email, username, password } = req.body;
        // if user already exist
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }
        //password secure
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error hashing password",
            });
        }
        //create entry for user
        const newUser = await user.create({
            email,
            username,
            password: hashedPassword,
        });
        res.status(200).json({
            success: true,
            user: newUser,
            message: "User created successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: error,
            message: "Error creating user",
        });
    }
};

//login handler
exports.login = async(req, res) => {
    try {
        //fetch data
        const { email, password } = req.body;
        //validate user
        if (!email || !password) {
            return res.status(401).json({
                success: false,
                message: "Please provide email and password",
            });
        }
        //check if user exist
        const existingUser = await user.findOne({ email });

        if (!existingUser) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        let payload = {
            email: existingUser.email,
            id: existingUser._id,
            role: existingUser.role,
        };

        //verify password and generate JWT token
        if (await bcrypt.compare(password, existingUser.password)) {
            //create jwt token
            let token = jwt.sign(payload, process.env.JWT_SECRET || "martin", {
                expiresIn: "2h",
            });
            const userObject = existingUser.toObject();

            userObject.token = token;
            userObject.password = undefined;

            let options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                userObject,
                message: "User logged in successfully",
            });
        } else {
            //password does not match
            return res.status(403).json({
                success: false,
                message: "Invalid password",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error logging in",
            error: error,
        });
    }
};
//logout
exports.logout = async(req, res) => {
    try {
        // Clear the token cookie
        res.clearCookie("token");

        return res.status(200).json({
            success: true,
            message: "User logged out successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error during logout",
            error: error,
        });
    }
};