const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
    try {
        //extract JWT token
        console.log("cookies", req.cookies);
        console.log("header", req.header("Authorization"));

        let token;

        // Check if token exists in cookies
        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }
        // If not in cookies, check Authorization header
        else if (req.header("Authorization")) {
            token = req.header("Authorization").replace("Bearer ", "");
        }

        console.log("token", token);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing",
            });
        }

        //verify token
        try {
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET || "martin"
            );
            console.log(decoded);
            // req.user = decoded; // Changed from res.user to req.user
            // Add user from payload
            req.userId = decoded.userId || decoded.id;
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }
        next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};