// const router = require("express").Router();
// const transferController = require("../controller/Transfer");
// const {
//     validateDeposit,
//     validateWithdraw,
// } = require("../middleware/validation");

// /**
//  * @route POST /deposit
//  * @description Deposit ETH to a specified address
//  * @access Public
//  */
// router.post("/deposit", validateDeposit, async(req, res) => {
//     try {
//         const { toAddress, amount, privateKey } = req.body;

//         // Perform the deposit
//         const result = await transferController.depositETH(
//             toAddress,
//             amount,
//             privateKey
//         );

//         if (result.success) {
//             return res.status(200).json(result);
//         } else {
//             return res.status(400).json(result);
//         }
//     } catch (error) {
//         console.error("Error in deposit endpoint:", error);
//         return res.status(500).json({
//             success: false,
//             error: "Internal server error",
//         });
//     }
// });

// /**
//  * @route POST /withdraw
//  * @description Withdraw ETH from a wallet to a specified address
//  * @access Public
//  */
// router.post("/withdraw", validateWithdraw, async(req, res) => {
//     try {
//         const { fromPrivateKey, toAddress, amount } = req.body;

//         // Perform the withdrawal
//         const result = await transferController.withdrawETH(
//             fromPrivateKey,
//             toAddress,
//             amount
//         );

//         if (result.success) {
//             return res.status(200).json(result);
//         } else {
//             return res.status(400).json(result);
//         }
//     } catch (error) {
//         console.error("Error in withdraw endpoint:", error);
//         return res.status(500).json({
//             success: false,
//             error: "Internal server error",
//         });
//     }
// });

// /**
//  * @route GET /balance/:address
//  * @description Get ETH balance for an address
//  * @access Public
//  */
// router.get("/balance/:address", async(req, res) => {
//     try {
//         const { address } = req.params;

//         // Get the balance
//         const result = await transferController.getETHBalance(address);

//         if (result.success) {
//             return res.status(200).json(result);
//         } else {
//             return res.status(400).json(result);
//         }
//     } catch (error) {
//         console.error("Error in balance endpoint:", error);
//         return res.status(500).json({
//             success: false,
//             error: "Internal server error",
//         });
//     }
// });

// module.exports = router;