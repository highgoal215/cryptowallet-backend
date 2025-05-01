// import Wallet from '../models/wallet';
// import { generateWallet, generateBitcoinWallet } from '../utils/wallet.utils.js';
const Wallet = require('../models/wallet');
const {
    generatEthereWallet,
    generateBitcoinWallet,
    generateTronWallet,
} = require("../utils/wallet.utils");

// interface AuthRequest extends Request {
//   userId: string;
// }

exports.createWallet = async(req, res) => {
    const { addressType, accountName } = req.body;
    console.log('--------->Request header:', req.headers);
    console.log('--------->Request body:', req.body);
    console.log('--------->User ID:', req.userId); // Add this to debug
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
            balance: 0,
            createdAt: new Date(),
        });

        res.status(201).json(wallet);
    } catch (err) {
        res.status(500).json({ msg: 'Wallet creation failed', error: (err).message });
    }
};