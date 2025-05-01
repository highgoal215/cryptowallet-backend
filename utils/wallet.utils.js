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

// export const generateBitcoinWallet = () => {
//     const keypair = bitcoin.ECPair.makeRandom();
//     const { address } = bitcoin.payments.p2pkh({ pubkey: keypair.publckey });
//     return {
//         address: address!,
//         privateKey: keypair.toWIF(),
//     };
// };