const User = require('../models/User')
const jwt = require('jsonwebtoken')

exports.login = async function (req, res) {
    const { email, password } = req.body;

    try {
        if (!email && !password) throw new Error("Email and password are required")

        //authenticate user
        const user = await User.loginWithEmail(email, password);
        const token = await user.generateToken()

        console.log("From login function", user, token)

        res.status(200).json({ status: "Success", data: { user, token } })
    } catch (err) {

        console.log("login error stack", err) // =>> to see the stack

        res.status(401).json({ status: "fail here??", message: err.message })
    }
}

exports.logout = async function (req, res) {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        const user = await User.updateOne({ _id: req.user._id }, { $pull: { tokens: token } });
        res.status(204).json({ status: "Success", data: null })
    } catch (err) {
        console.log("logout error", err)
        res.status(401).json({ status: "fail", message: err.message });
    }
}
//authenticate with JWT
exports.auth = async (req, res, next) => {


    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer"))
        return res.status(401).json({ status: "fail", message: "Unauthorized" });

    const token = req.headers.authorization.replace("Bearer ", "");
    try {
        const decoded = jwt.verify(token, process.env.SECRET)

        const user = await User.findOne({ _id: decoded.id, tokens: token })

        if (!user) throw new Error("Unauthorized")

        //attach user obj to req obj
        req.user = user;
    } catch (err) {

        return res.status(401).json({ status: "Fail", message: err.message })
    };
    next()
}