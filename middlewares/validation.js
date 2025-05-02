// // Validation middleware for transfer routes
// exports.validateDeposit = (req, res, next) => {
//     const { toAddress, amount, privateKey } = req.body;

//     // Check if all required fields are present
//     if (!toAddress || !amount || !privateKey) {
//         return res.status(400).json({
//             success: false,
//             error: "Missing required fields: toAddress, amount, and privateKey are required",
//         });
//     }

//     // Validate Ethereum address format
//     if (!toAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
//         return res.status(400).json({
//             success: false,
//             error: "Invalid Ethereum address format",
//         });
//     }

//     // Validate amount is a positive number
//     if (isNaN(amount) || parseFloat(amount) <= 0) {
//         return res.status(400).json({
//             success: false,
//             error: "Amount must be a positive number",
//         });
//     }

//     // Validate private key format
//     if (!privateKey.match(/^0x[a-fA-F0-9]{64}$/) &&
//         !privateKey.match(/^[a-fA-F0-9]{64}$/)
//     ) {
//         return res.status(400).json({
//             success: false,
//             error: "Invalid private key format",
//         });
//     }

//     next();
// };

// exports.validateWithdraw = (req, res, next) => {
//     const { fromPrivateKey, toAddress, amount } = req.body;

//     // Check if all required fields are present
//     if (!fromPrivateKey || !toAddress || !amount) {
//         return res.status(400).json({
//             success: false,
//             error: "Missing required fields: fromPrivateKey, toAddress, and amount are required",
//         });
//     }

//     // Validate Ethereum address format
//     if (!toAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
//         return res.status(400).json({
//             success: false,
//             error: "Invalid Ethereum address format",
//         });
//     }

//     // Validate amount is a positive number
//     if (isNaN(amount) || parseFloat(amount) <= 0) {
//         return res.status(400).json({
//             success: false,
//             error: "Amount must be a positive number",
//         });
//     }

//     // Validate private key format
//     if (!fromPrivateKey.match(/^0x[a-fA-F0-9]{64}$/) &&
//         !fromPrivateKey.match(/^[a-fA-F0-9]{64}$/)
//     ) {
//         return res.status(400).json({
//             success: false,
//             error: "Invalid private key format",
//         });
//     }

//     next();
// };