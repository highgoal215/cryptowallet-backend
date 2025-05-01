const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
}, {
    timestamps: true,
    // versionKey: false // Disable the __v field
});


const User = mongoose.model("User", userSchema);

module.exports = User; // Export the model, not just the schema