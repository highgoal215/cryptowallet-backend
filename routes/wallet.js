const router = require("express").Router();

const {
    createWallet,
    universalEthTransfer,
    importWalletFromPrivateKey,
} = require("../controller/Wallet");
const { auth } = require("../middlewares/auth");

// router.post("/signup", signUp);
// router.post("/login", login);
router.post("/walletcreate", auth, createWallet);
// Add the new transfer route
router.post("/transfer/eth", universalEthTransfer);
router.post("/importwallet", auth, importWalletFromPrivateKey);
// //protected routes( middlewares )
// router.post("/createwallet", auth, (req, res) => {
//     // res.json({
//     //     success: true,
//     //     message: "create wallet",
//     // });
//     // await createWallet(req, res)
//     try {
//         // const authReq = req as AuthRequest;
//         // authReq.userId = "";  // Ensure userId is set from middleware
//         createWallet(req, res);
//         // const userId = req.userId;

//     } catch (error) {
//         console.error("Error in createWallet route:", error);
//     }
// });
// router.get("/student", auth, isStudent, (req, res) => {
//     res.json({
//         success: true,
//         message: "Student route",
//     });
// });
// router.get("/admin", auth, isAdmin, (req, res) => {
//     res.json({
//         success: true,
//         message: "Admin route",
//     });
// });

module.exports = router;