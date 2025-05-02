// const { ethers } = require("ethers");
// const walletUtils = require("../utils/wallet.utils");

// // Get provider based on network (mainnet, testnet, etc.)
// const getProvider = (network = "sepolia") => {
//     const Infura_API_Key = process.env.Infura_API_key;
//     if (!Infura_API_Key) {
//         throw new Error("Infura API key is not defined in environment variables");
//     }

//     return new ethers.JsonRpcProvider(
//         `https://${network}.infura.io/v3/${Infura_API_Key}`
//     );
// };

// // Deposit ETH to a specified address
// exports.depositETH = async(toAddress, amountInEther, privateKey) => {
//     try {
//         const provider = getProvider();
//         const wallet = new ethers.Wallet(privateKey, provider);

//         // Convert ether to wei
//         const amountInWei = ethers.parseEther(amountInEther.toString());

//         // Create transaction
//         const tx = {
//             to: toAddress,
//             value: amountInWei,
//         };

//         // Send transaction
//         const transaction = await wallet.sendTransaction(tx);
//         console.log(`Transaction hash: ${transaction.hash}`);

//         // Wait for transaction to be mined
//         const receipt = await transaction.wait();

//         return {
//             success: true,
//             transactionHash: transaction.hash,
//             blockNumber: receipt.blockNumber,
//             from: wallet.address,
//             to: toAddress,
//             amount: amountInEther,
//         };
//     } catch (error) {
//         console.error("Error in depositETH:", error);
//         return {
//             success: false,
//             error: error.message,
//         };
//     }
// };

// // Withdraw ETH from wallet to a specified address
// exports.withdrawETH = async(fromPrivateKey, toAddress, amountInEther) => {
//     try {
//         const provider = getProvider();
//         const wallet = new ethers.Wallet(fromPrivateKey, provider);

//         // Convert ether to wei
//         const amountInWei = ethers.parseEther(amountInEther.toString());

//         // Create transaction
//         const tx = {
//             to: toAddress,
//             value: amountInWei,
//         };

//         // Send transaction
//         const transaction = await wallet.sendTransaction(tx);
//         console.log(`Transaction hash: ${transaction.hash}`);

//         // Wait for transaction to be mined
//         const receipt = await transaction.wait();

//         return {
//             success: true,
//             transactionHash: transaction.hash,
//             blockNumber: receipt.blockNumber,
//             from: wallet.address,
//             to: toAddress,
//             amount: amountInEther,
//         };
//     } catch (error) {
//         console.error("Error in withdrawETH:", error);
//         return {
//             success: false,
//             error: error.message,
//         };
//     }
// };

// // Get ETH balance for an address
// exports.getETHBalance = async(address) => {
//     try {
//         const provider = getProvider();
//         const balanceInWei = await provider.getBalance(address);
//         const balanceInEther = ethers.formatEther(balanceInWei);

//         return {
//             success: true,
//             address: address,
//             balanceInWei: balanceInWei.toString(),
//             balanceInEther: balanceInEther,
//         };
//     } catch (error) {
//         console.error("Error in getETHBalance:", error);
//         return {
//             success: false,
//             error: error.message,
//         };
//     }
// };

// // Create a new ETH wallet
// exports.createETHWallet = async() => {
//     try {
//         const wallet = await walletUtils.generatEthereWallet();
//         return {
//             success: true,
//             address: wallet.address,
//             privateKey: wallet.privateKey,
//         };
//     } catch (error) {
//         console.error("Error in createETHWallet:", error);
//         return {
//             success: false,
//             error: error.message,
//         };
//     }
// };