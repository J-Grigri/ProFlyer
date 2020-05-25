const router = require('express').Router()

const { login, logout, auth } = require("../controllers/authController")
const { loginFacebook, facebookAuth } = require("../auth/fbHandler")
const { loginGG, GGAuth } = require("../auth/ggHandler")

router.post("/login", login);
router.get("/logout", auth, logout);

router.get("/facebook", loginFacebook);
router.get("/facebook/authorized", facebookAuth);
router.get("/google", loginGG);
router.get("/google/authorized", GGAuth);

module.exports = router;