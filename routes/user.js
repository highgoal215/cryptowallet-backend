const router = require("express").Router();
const { signUp, login, logout } = require("../controller/Auth");

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout)

// //protected routes( middlewares )
// router.get("/test", auth, (req, res) => {
//     res.json({
//         success: true,
//         message: "test route",
//     });
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