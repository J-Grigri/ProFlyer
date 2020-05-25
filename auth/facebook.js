const strategy = require("passport-facebook");
const FacebookStrategy = strategy.Strategy;
const User = require('../models/User');
require("dotenv").config({ path: ".env" });

module.exports = new FacebookStrategy(
    // 1st arg is configuration
    {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.DOMAIN + process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ["id", "email", "name"]
    },
    // verification function (callback)
    async function (accessToken, refreshToken, profile, next) {
        const email = profile._json.email
        const name = profile._json.first_name + ' ' + profile._json.last_name;

        const user = await User.findOneOrCreate(email, name);

        next(null, user);
    }
);


