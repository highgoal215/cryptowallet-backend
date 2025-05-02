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
        `https://eth-sepolia.g.alchemy.com/v2/fDVyRKUELxC6pGpxxG2M7eVc7ErbTI4t`
    );
    console.log("--------->", provider);
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

exports.transferEth = async(SendPrivateKey, toAddress, amountInEther) => {
    try {
        console.log("Input values:", {
            SendPrivateKey,
            toAddress,
            amountInEther,
            amountType: typeof amountInEther,
        });

        // Create provider with explicit network and timeout settings
        const provider = new ethers.JsonRpcProvider(
            `https://eth-sepolia.g.alchemy.com/v2/fDVyRKUELxC6pGpxxG2M7eVc7ErbTI4t`, {
                name: "sepolia",
                chainId: 11155111,
                ensAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e0e",
            }
        );

        // Test the connection
        try {
            await provider.getNetwork();
            console.log("Successfully connected to Sepolia network");
        } catch (error) {
            console.error("Failed to connect to Sepolia network:", error);
            throw new Error(
                "Failed to connect to Ethereum network. Please check your internet connection and try again."
            );
        }

        // Create wallet instance from private key
        const Getwallet = new Wallet(SendPrivateKey, provider);
        const fromAddress = Getwallet.address;
        console.log("Wallet address:", fromAddress);

        // Get sender's current balance
        const senderBalance = await provider.getBalance(fromAddress);

        console.log("Sender balance in wei:", senderBalance.toString());

        // Convert amount to wei
        const amountInWei = ethers.parseEther(amountInEther.toString());

        // Get current gas price
        const feeData = await provider.getFeeData();

        console.log("Amount in wei:", amountInWei);
        console.log("Gas price:", feeData.gasPrice.toString());

        // Estimate gas limit for this transaction
        const gasLimit = 21000; // Standard ETH transfer gas limit

        // Calculate total transaction cost (amount + gas)
        const gasCost = feeData.gasPrice * BigInt(gasLimit);

        console.log("BigInt(gasLimit)--->:", BigInt(gasLimit));
        const totalCost = amountInWei + gasCost;
        console.log("Type======?:", {
            Type: typeof totalCost,
        });
        console.log("TypeSender======?:", {
            Type: typeof senderBalance,
        });
        console.log("Totalcost-->:", totalCost);
        console.log("Calculated values:", {
            gasCost: gasCost.toString(),
            totalCost: totalCost.toString(),
            senderBalance: senderBalance.toString(),
        });

        // Check if sender has enough balance including gas
        if (senderBalance < totalCost) {
            const errorDetails = {
                fromAddress: fromAddress,
                balance: ethers.formatEther(senderBalance),
                amountToSend: ethers.formatEther(amountInWei),
                estimatedGasCost: ethers.formatEther(gasCost),
                totalRequired: ethers.formatEther(totalCost),
            };
            console.log("Insufficient balance error details:", errorDetails);
            return {
                success: false,
                error: "Insufficient balance to cover amount plus gas fees",
                details: errorDetails,
            };
        }

        // Create transaction with explicit gas parameters
        const tx = {
            to: toAddress,
            value: ethers.parseEther(amountInEther.toString()),
            // gasLimit: ethers.toBigInt(gasLimit.toString()),
            // gasPrice: feeData.gasPrice,
        };

        console.log("tx-------------->", tx);

        // Retry logic for sending the transaction
        // const sendTransactionWithRetry = async(wallet, tx, retries = 3) => {
        //     for (let i = 0; i < retries; i++) {
        //         try {
        //             return await wallet.sendTransaction(tx);
        //         } catch (error) {
        //             if (i === retries - 1) throw error;
        //             console.log(`Retrying transaction... (${i + 1}/${retries})`);
        //             await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
        //         }
        //     }
        // };

        // Send transaction
        // const transaction = await sendTransactionWithRetry(wallet, tx);
        const transaction = await Getwallet.sendTransaction(tx);
        console.log(`Transaction hash: ${transaction.hash}`);

        // Wait for transaction to be mined
        const receipt = await transaction.wait();

        console.log("reepit-------------->", receipt);
        console.log("here-------->");

        // Calculate actual gas used and cost
        const gasUsed = receipt.gasUsed;
        console.log("heasdfasdfre-------->");
        // const effectiveGasPrice = receipt.effectiveGasPrice;
        const gasPrice = feeData.gasPrice;
        if (!gasPrice) {
            throw new Error("Gas price is missing from the transaction receipt.");
        }
        console.log("here-----asdfasdf--->");
        const actualGasCost = gasUsed * gasPrice;
        console.log("here-----asdfasdfasdfasdfdsafds--->");

        return {
            success: true,
            transactionHash: transaction.hash,
            blockNumber: receipt.blockNumber.toString(),
            fromAddress: fromAddress,
            toAddress: toAddress,
            amount: ethers.formatEther(amountInWei),
            gasUsed: gasUsed.toString(),
            gasCost: ethers.formatEther(actualGasCost),
            totalCost: ethers.formatEther(amountInWei + actualGasCost),
        };
    } catch (error) {
        console.error("Error transferring ETH:", error);
        return {
            success: false,
            error: error.message,
        };
    }
};