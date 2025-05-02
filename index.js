const express = require("express");
const app = express();

require("dotenv").config();

const PORT = process.env.PORT;

const DB = require("./config/database");
DB();

app.use(express.json());

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const userRouter = require("./routes/user");
const walletRouter = require("./routes/wallet");
// const transferRouter = require("./routes/transfer");
app.use("/api/", userRouter);
app.use("/api/", walletRouter);
// app.use("/api/", transferRouter);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});