const passport = require("passport");
const fbs = require('./facebook')
const ggs = require('./google')

passport.use(fbs)
passport.use(ggs)

module.exports = passport
