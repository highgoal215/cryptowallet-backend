const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = () => {
    //   const connectionParams = {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    //   };

    mongoose.connect(
        process.env.MONGO_URI || "mongodb://localhost:27017/cryptowallet"
    );

    mongoose.connection.on("connected", () => {
        console.log("Connected to database successfully");
    });

    mongoose.connection.on("error", (err) => {
        console.log("Error connecting to database ", err);
    });
};

module.exports = dbConnect;