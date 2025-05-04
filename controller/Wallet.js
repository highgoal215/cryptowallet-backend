// import Wallet from '../models/wallet';
// import { generateWallet, generateBitcoinWallet } from '../utils/wallet.utils.js';
const crypto = require("crypto");
const { transferEth } = require("../utils/wallet.utils");
const Wallet = require("../models/wallet");
const {
    generatEthereWallet,
    generateBitcoinWallet,
    generateTronWallet,
} = require("../utils/wallet.utils");
const ethers = require("ethers");

// Encryption key (store this securely in environment variables)
const ENCRYPTION_KEY =
    process.env.ENCRYPTION_KEY || "12345678901234567890123456789asd"; // Must be 32 bytes
const IV_LENGTH = 16; // Initialization vector length
// Function to encrypt data
function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(
        "aes-256-cbc",
        Buffer.from(ENCRYPTION_KEY || "12345678901234567890123456789asd"),
        iv
    );
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
}

// Function to decrypt data
function decrypt(text) {
    const textParts = text.split(":");
    const iv = Buffer.from(textParts.shift(), "hex");
    const encryptedText = Buffer.from(textParts.join(":"), "hex");
    const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        Buffer.from(ENCRYPTION_KEY || "12345678901234567890123456789asd"),
        iv
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

exports.createWallet = async(req, res) => {
    const { addressType, accountName } = req.body;
    try {
        let walletData;

        if (addressType === "ethereum") {
            walletData = await generatEthereWallet();
        } else if (addressType === "bitcoin") {
            walletData = await generateBitcoinWallet();
        } else if (addressType == "tron") {
            walletData = await generateTronWallet();
        } else {
            return res.status(400).json({ msg: "Unsupported wallet type" });
        }
        // Encrypt the private key before saving
        const encryptedPrivateKey = encrypt(walletData.privateKey);
        console.log("--------->encryptedPrivateKey", encryptedPrivateKey);
        const wallet = await Wallet.create({
            user: req.userId,
            addressType,
            accountName,
            address: walletData.address,
            // privateKey: walletData.privateKey, // Encrypt in production
            privateKey: encryptedPrivateKey, // Encrypt in production
            balance: 0,
            createdAt: new Date(),
        });

        res.status(201).json(wallet);
    } catch (err) {
        res.status(500).json({ msg: "Wallet creation failed", error: err.message });
    }
};

// Add this function to your existing Wallet controller

/// transfer part
exports.universalEthTransfer = async(req, res) => {
    try {
        // console.log("--------->Request header:", req.headers);
        const { fromAddress, toAddress, amount } = req.body;

        // Validate inputs
        if (!fromAddress || !toAddress || !amount) {
            return res.status(400).json({
                success: false,
                message: "Missing required parameters: toAddress, or amount",
            });
        }

        // Validate Ethereum address format
        if (!ethers.isAddress(fromAddress) || !ethers.isAddress(toAddress)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Ethereum address format",
            });
        }
        // Validate amount is a positive number
        const amountNum = parseFloat(amount);
        console.log("++++++++++++>:", amountNum);
        if (isNaN(amountNum) || amountNum <= 0) {
            return res.status(400).json({
                success: false,
                message: "Amount must be a positive number",
            });
        }
        const senderwallet = await Wallet.findOne({ address: fromAddress });
        if (!senderwallet) {
            return res.status(400).json({
                success: false,
                message: "Sender wallet not found",
            });
        }
        const SendPrivateKey = decrypt(senderwallet.privateKey);
        console.log("++++++++++++>===========>SendPrivateKey:", SendPrivateKey);
        const result = await transferEth(SendPrivateKey, toAddress, amountNum);
        console.log("++++++++++++>===========>result:", result);
        if (result.success == true) {
            try {
                // const Infura_API_Key = process.env.Infura_API_key;
                const provider = new ethers.JsonRpcProvider(
                    `https://eth-sepolia.g.alchemy.com/v2/fDVyRKUELxC6pGpxxG2M7eVc7ErbTI4t`
                );

                // Update source wallet balance
                const senderWallet = await Wallet.findOne({
                    address: result.fromAddress,
                    addressType: "ethereum",
                });
                console.log("++++++++++++>===========>result+++++++++++++>:");

                if (senderWallet) {
                    const currentBalance = await provider.getBalance(result.fromAddress);
                    console.log(
                        "++++++++++++>===========>currentBalance:",
                        currentBalance
                    );
                    senderWallet.balance = parseFloat(ethers.formatEther(currentBalance));
                    senderWallet.lastUpdated = new Date(); // Update the balance update time
                    await senderWallet.save();
                }

                // Update receiver wallet
                const receiverWallet = await Wallet.findOne({
                    address: result.toAddress,
                    addressType: "ethereum",
                });

                if (receiverWallet) {
                    const currentBalance = await provider.getBalance(result.toAddress);
                    receiverWallet.balance = parseFloat(
                        ethers.formatEther(currentBalance)
                    );
                    receiverWallet.lastUpdated = new Date(); // Update the balance update time
                    await receiverWallet.save();
                }
            } catch (dbError) {
                console.error("Database update error (non-critical):", dbError);
            }

            return res.status(200).json({
                success: true,
                message: "ETH transferred successfully",
                transaction: {
                    hash: result.transactionHash,
                    blockNumber: result.blockNumber,
                    fromAddress: result.fromAddress,
                    toAddress: result.toAddress,
                    amount: result.amount,
                    gasUsed: result.gasUsed,
                    gasCost: result.gasCost,
                    totalCost: result.totalCost,
                },
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Failed to transfer ETH",
                error: result.error,
                details: result.details,
            });
        }
    } catch (error) {
        console.error("Error transferring ETH:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

exports.importWalletFromPrivateKey = async(req, res) => {
    try {
        const { privateKey, accountName, addressType } = req.body;
        console.log(
            "++++++++++++>privateKey:",
            privateKey,
            accountName,
            addressType
        );
        // Validate inputs
        if (!privateKey || !accountName || !addressType) {
            return res.status(400).json({
                success: false,
                message: "Missing required parameters: privateKey, accountName, or addressType",
            });
        }

        // Create a wallet instance from the private key
        const wallet = new ethers.Wallet(privateKey);

        // Check if the wallet already exists in the database
        const existingWallet = await Wallet.findOne({
            address: wallet.address,
            addressType,
        });
        if (existingWallet) {
            return res.status(400).json({
                success: false,
                message: "Wallet already exists in the database",
            });
        }
        // Create a provider to fetch the balance
        const provider = new ethers.JsonRpcProvider(
            `https://eth-sepolia.g.alchemy.com/v2/fDVyRKUELxC6pGpxxG2M7eVc7ErbTI4t`
        );
        // Fetch the wallet balance
        const balanceInWei = await provider.getBalance(wallet.address);
        const balanceInEther = parseFloat(ethers.formatEther(balanceInWei));
        console.log("balanceInEther:", balanceInEther);
        // Encrypt the private key before saving
        const encryptedPrivateKey = encrypt(privateKey);
        // Save the wallet in the database
        const newWallet = await Wallet.create({
            user: req.userId, // Assuming `req.userId` contains the authenticated user's ID
            addressType,
            accountName,
            address: wallet.address,
            // privateKey: privateKey, // Encrypt this in production
            privateKey: encryptedPrivateKey, // Encrypt this in production
            balance: balanceInEther, // Default balance
            createdAt: new Date(),
        });

        return res.status(201).json({
            success: true,
            message: "Wallet imported successfully",
            wallet: {
                id: newWallet._id,
                address: newWallet.address,
                accountName: newWallet.accountName,
                addressType: newWallet.addressType,
                balance: newWallet.balance,
            },
        });
    } catch (error) {
        console.error("Error importing wallet:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.getAllWallets = async(req, res) => {
    try {
        const wallets = await Wallet.find(); // Fetch all wallets from the database
        res.status(200).json({
            success: true,
            wallets,
        });
    } catch (error) {
        console.error("Error fetching wallets:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch wallets",
            error: error.message,
        });
    }
};