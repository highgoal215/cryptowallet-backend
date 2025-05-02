// import Wallet from '../models/wallet';
// import { generateWallet, generateBitcoinWallet } from '../utils/wallet.utils.js';

const { transferEth } = require("../utils/wallet.utils");
const Wallet = require("../models/wallet");
const {
    generatEthereWallet,
    generateBitcoinWallet,
    generateTronWallet,
} = require("../utils/wallet.utils");
const ethers = require("ethers");
// interface AuthRequest extends Request {
//   userId: string;
// }

// const getProvider = () => {
//     const Infura_API_Key = process.env.Infura_API_key;
//     if (!Infura_API_Key) {
//         throw new Error("Infura API key is not defined in environment variables");
//     }
//     return new ethers.JsonRpcProvider(
//         `https://eth-sepolia.g.alchemy.com/v2/fDVyRKUELxC6pGpxxG2M7eVc7ErbTI4t`
//     );
// };

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

        const wallet = await Wallet.create({
            user: req.userId,
            addressType,
            accountName,
            address: walletData.address,
            privateKey: walletData.privateKey, // Encrypt in production
            balance: parseFloat(etjers.formatEther(currentBalance)),
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
        const { fromPrivateKey, toAddress, amount } = req.body;

        // Validate inputs
        if (!fromPrivateKey || !toAddress || !amount) {
            return res.status(400).json({
                success: false,
                message: "Missing required parameters: fromPrivateKey, toAddress, or amount",
            });
        }

        // Validate Ethereum address format
        if (!ethers.isAddress(toAddress)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Ethereum address format",
            });
        }

        // Validate amount is a positive number
        const amountNum = parseFloat(amount);
        console.log("++++++++++++>amountNum:", amountNum);
        console.log("++++++++++++>amountNum:", amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            return res.status(400).json({
                success: false,
                message: "Amount must be a positive number",
            });
        }
        // const amountInWei = ethers.parseEther(amountNum.toString());
        // const sendAmount = ethers.utils.parseUnits(amountNum, "ether");
        // console.log("++++++++++++))))))>amountInWei:", sendAmount);
        // Execute the transfer with the provided private key
        // const result = await transferEth(fromPrivateKey, toAddress, amountInWei);
        const result = await transferEth(fromPrivateKey, toAddress, amountNum);

        if (result.success) {
            try {
                // const Infura_API_Key = process.env.Infura_API_key;
                const provider = new ethers.JsonRpcProvider(
                    `https://eth-sepolia.g.alchemy.com/v2/fDVyRKUELxC6pGpxxG2M7eVc7ErbTI4t`
                );

                // Update source wallet balance
                const sourceWallet = await Wallet.findOne({
                    address: result.fromAddress,
                    addressType: "ETH",
                });

                if (sourceWallet) {
                    const currentBalance = await provider.getBalance(
                        sourceWallet.address
                    );
                    console.log("++++++++++++))))))>currentBalance:", currentBalance);
                    sourceWallet.balance = parseFloat(ethers.formatEther(currentBalance));
                    await sourceWallet.save();
                }

                // Update destination wallet balance
                const destWallet = await Wallet.findOne({
                    address: toAddress,
                    addressType: "ETH",
                });

                if (destWallet) {
                    const currentBalance = await provider.getBalance(destWallet.address);
                    destWallet.balance = parseFloat(ethers.formatEther(currentBalance));
                    await destWallet.save();
                } else {
                    // If the destination wallet is not in the database, create a new entry
                    const currentBalance = await provider.getBalance(toAddress);
                    await Wallet.create({
                        user: null, // Assign user if applicable
                        addressType: "ETH",
                        accountName: "External Wallet", // Default name
                        address: toAddress,
                        privateKey: null, // No private key for external wallets
                        balance: parseFloat(ethers.formatEther(currentBalance)),
                        createdAt: new Date(),
                    });
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
                    totalCost: result.totalCost
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
        console.error("Error in universalEthTransfer:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};