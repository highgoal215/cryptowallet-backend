/// ether.js
const { ethers, Wallet } = require("ethers");
/// bitcoinjs-lib
const bitcoin = require("bitcoinjs-lib");
const ECPairFactory = require("ecpair").default;
const ecc = require("tiny-secp256k1");
const fs = require("fs");

const ECPair = ECPairFactory(ecc);
const network = bitcoin.networks.testnet; // Otherwise, bitcoin = mainnet and regnet = local
/// tronweb
// const TronWeb = require("tronweb");
///ether wallet
exports.generatEthereWallet = async() => {
    // const Infura_API_Key = process.env.Infura_API_key;
    const provider = new ethers.JsonRpcProvider(
        `https://sepolia.infura.io/ws/v3/${Infura_API_Key}`
    );
    console.log("--------->", Infura_API_Key);
    const wallet = Wallet.createRandom(provider);
    return {
        address: wallet.address,
        privateKey: wallet.privateKey,
    };
};

///bitcoin wallet
exports.generateBitcoinWallet = async() => {
    try {
        const keyPair = ECPair.makeRandom({ network: network });
        const { address } = bitcoin.payments.p2pkh({
            pubkey: keyPair.publicKey,
            network: network,
        });
        const privateKey = keyPair.toWIF();

        console.log(`| Public Address | ${address} |`);
        console.log(`| Private Key | ${privateKey} |`);

        const wallet = {
            address: address,
            privateKey: privateKey,
        };
        // const walletJSON = JSON.stringify(wallet, null, 4);
        // fs.writeFileSync("wallet.json", walletJSON);

        console.log(`Wallet created and saved to wallet.json`);
        return wallet;
    } catch (error) {
        console.log(error);
    }
};

///TronWallet
exports.generateTronWallet = async() => {
    console.log("--------->Hey");
    var crypto = require("crypto");
    var privateKey = crypto.randomBytes(32).toString("hex");
    console.log("Private Key", privateKey);
    const HttpProvider = TronWeb.providers.HttpProvider;
    const fullNode = new HttpProvider("https://api.trongrid.io");
    const solidityNode = new HttpProvider("https://api.trongrid.io");
    const eventServer = new HttpProvider("https://api.trongrid.io");
    const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);

    const newWallet = await tronWeb.createAccount();
    console.log("---------->", newWallet);
    return {
        address: newWallet.address.base58,
        privateKey: newWallet.privateKey,
    };
};
///TronWallet
// exports.generateTronWallet = async() => {
//     // Import TronWeb directly in the function
//     const TronWeb = require("tronweb");

//     // Check what's available in TronWeb
//     console.log("TronWeb type:", typeof TronWeb);
//     console.log("TronWeb properties:", Object.keys(TronWeb));

//     // Try different ways to instantiate TronWeb
//     let tronWeb;
//     if (typeof TronWeb === 'function') {
//         tronWeb = new TronWeb({
//             fullHost: 'https://api.trongrid.io'
//         });
//     } else if (TronWeb.default && typeof TronWeb.default === 'function') {
//         tronWeb = new TronWeb.default({
//             fullHost: 'https://api.trongrid.io'
//         });
//     } else {
//         throw new Error('Unable to instantiate TronWeb correctly');
//     }

//     // Generate a new account
//     const account = await tronWeb.createAccount();

//     console.log("---------->", account);
//     return {
//         address: account.address.base58,
//         privateKey: account.privateKey,
//     };
// }

///TronWallet

// Add this function to your existing utils/wallet.utils.js file

exports.transferEth = async(fromPrivateKey, toAddress, amountInEther) => {
    try {
        const provider = new ethers.JsonRpcProvider(
            `https://eth-sepolia.g.alchemy.com/v2/fDVyRKUELxC6pGpxxG2M7eVc7ErbTI4t`
        );

        // Create wallet instance from private key
        const wallet = new Wallet(fromPrivateKey, provider);
        const fromAddress = wallet.address;

        // Get sender's current balance
        const senderBalance = await provider.getBalance(fromAddress);

        // Convert ether to wei
        const amountInWei = ethers.parseEther(amountInEther.toString());

        // Get current gas price
        const feeData = await provider.getFeeData();

        // Estimate gas limit for this transaction
        const gasLimit = BigInt(21000); // Standard ETH transfer gas limit

        // Calculate total transaction cost (amount + gas)
        const gasCost = feeData.gasPrice * gasLimit; // feeData.gasPrice is already a BigInt
        const totalCost = amountInWei + gasCost;

        // Check if sender has enough balance including gas
        if (senderBalance < totalCost) {
            return {
                success: false,
                error: "Insufficient balance to cover amount plus gas fees",
                details: {
                    fromAddress: fromAddress,
                    balance: ethers.formatEther(senderBalance),
                    amountToSend: amountInEther,
                    estimatedGasCost: ethers.formatEther(gasCost),
                    totalRequired: ethers.formatEther(totalCost),
                },
            };
        }

        // Create transaction with explicit gas parameters
        const tx = {
            to: toAddress,
            value: amountInWei,
            gasLimit: gasLimit,
            gasPrice: feeData.gasPrice,
        };

        // Send transaction
        const transaction = await wallet.sendTransaction(tx);
        console.log(`Transaction hash: ${transaction.hash}`);

        // Wait for transaction to be mined
        const receipt = await transaction.wait();

        // Calculate actual gas used and cost
        const gasUsed = receipt.gasUsed;
        const effectiveGasPrice = receipt.effectiveGasPrice;
        const actualGasCost = gasUsed * effectiveGasPrice;

        return {
            success: true,
            transactionHash: transaction.hash,
            blockNumber: receipt.blockNumber,
            fromAddress: fromAddress,
            toAddress: toAddress,
            amount: amountInEther,
            gasUsed: gasUsed.toString(), // Convert BigInt to string
            gasCost: ethers.formatEther(actualGasCost), // Already a string
            totalCost: ethers.formatEther(amountInWei + actualGasCost), // Already a string
        };
    } catch (error) {
        console.error("Error transferring ETH:", error);
        return {
            success: false,
            error: error.message,
        };
    }
};