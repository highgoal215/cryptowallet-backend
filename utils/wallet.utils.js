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
    const polygonRPC = process.env.POLYGON_RPC_URL || "https://polygon-rpc.com/";
    const provider = new ethers.JsonRpcProvider(polygonRPC);
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
        const tronWeb = new TronWeb(
            fullNode,
            solidityNode,
            eventServer,
            privateKey
        );

        const newWallet = await tronWeb.createAccount();
        console.log("---------->",
            newWallet);
        return {
            address: newWallet.address.base58,
            privateKey: newWallet.privateKey,
        };
    }
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