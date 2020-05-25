const GoogleStrategy = require('passport-google-oauth2').Strategy;
const User = require("../models/User")
require("dotenv").config({ path: ".env" });

module.exports = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.DOMAIN + process.env.GOOGLE_CB_URL,
        scope: ["email", "profile"]
    },
    async function (accessToken, refreshToken, profile, next) {
        console.log("PROFILEEEE", profile._json)
        const { name, email } = profile._json

        const user = await User.findOneOrCreate(email, name)
        next(null, user)

        console.log("uzer", user)
    }
)
