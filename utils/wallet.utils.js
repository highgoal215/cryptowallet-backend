const bitcoin = require("bitcoinjs-lib");
const ECPairFactory = require("ecpair").default;
const ecc = require("tiny-secp256k1");
const fs = require("fs");

const ECPair = ECPairFactory(ecc);
const network = bitcoin.networks.testnet; // Otherwise, bitcoin = mainnet and regnet = local
// import { ethers } from 'ethers';
// import * as bitcoin from "bitcoinjs-lib";
const ethers = require("ethers");

exports.generateWallet = () => {
    const wallet = ethers.Wallet.createRandom();
    return {
        address: wallet.address,
        privateKey: wallet.privateKey,
    };
};

// exports.generateBitcoinWallet = () => {
//     const keypair = bitcoin.ECPair.makeRandom();
//     const { address } = bitcoin.payments.p2pkh({ pubkey: keypair.publckey });
//     return {
//         address: address!,
//         privateKey: keypair.toWIF(),
//     };
// };

exports.generateBitcoinWallet = () => {
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