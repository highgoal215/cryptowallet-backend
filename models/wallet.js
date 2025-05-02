const mongoose = require("mongoose");


const walletSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    addressType: { type: String, required: true },
    accountName: { type: String, required: true },
    address: { type: String, required: true },
    privateKey: { type: String, required: true },
    balance: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now }, // Add this field
});
const Wallet = mongoose.model("Wallet", walletSchema);

module.exports = Wallet;