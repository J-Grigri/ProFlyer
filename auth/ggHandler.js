const passport = require('passport')
require("dotenv").config({ path: ".env" });

exports.loginGG = passport.authenticate("google")

exports.GGAuth = function (req, res, next) {
    passport.authenticate("google", function (err, user) {
        if (err) return res.redirect(process.env.CLIENT_URL_LOGIN)
        console.log("+__+", user.tokens)

        res.redirect(`${process.env.CLIENT_URL}/main?token=${user.tokens[user.tokens.length - 1]}`)
    })(req, res, next);
}
