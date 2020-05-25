const passport = require("passport")
require("dotenv").config({ path: ".env" });

exports.loginFacebook = passport.authenticate("facebook", { scope: "email" });

exports.facebookAuth = function (req, res, next) {
    passport.authenticate("facebook", function (err, user) {
        console.log(user)
        if (err) return res.redirect(process.env.CLIENT_URL_LOGIN)
        res.redirect(`${process.env.CLIENT_URL}/main?token=${user.token}`);

    })(req, res, next);
}
