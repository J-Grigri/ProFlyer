const router = require('express').Router()

const { login, logout, auth } = require("../controllers/authController")

router.post("/login", login);
router.get("/logout", auth, logout);

module.exports = router;