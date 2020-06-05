const User = require("../models/User");
const gravatar = require('gravatar');
const sgMail = require('@sendgrid/mail');
const catchAsync = require("../utils/catchAsync")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

//Delete a user
const { deleteOne } = require("./handlerFactory");
exports.deleteUser = deleteOne(User);

const { updateOne } = require("./handlerFactory");
exports.updateUser = updateOne(User)



exports.createCoachProfile = catchAsync(async (req, res) => {

    const allows = ["coach.bio", "coach.inSportSince", "coach.experience", "coach.certifications", "coach.achievments", "coach.disciplines",]
    //foreach todelete notallowed fields
    Object.keys(req.body).forEach(el => {
        console.log(el, "keyname")
        if (!allows.includes(el)) {
            delete req.body[el]
        }
    });

    const user = await User.findOneAndUpdate({ _id: req.user._id }, {
        ...req.body,
        isCoach: true,
    }, { new: true })

    return res.status(200).json({ status: "Success", data: user })
})

//Register user in app
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body

    try {
        const avatar = gravatar.url(email, {
            s: '200',//size
            r: 'pg',//rating
            d: 'mm'
        }, true)
        const user = await User.create({ name, email, password, avatar })
        const token = await user.generateToken();
        res.status(201).json({ status: "Success", data: { user, token } })
    } catch (err) {
        res.status(400).json({ status: "Fail", data: null })
    }
};

//Read user 
exports.getUser = catchAsync(async (req, res) => {
    return res.status(200).json({ status: "Success", data: req.user })
})

// list of all coaches
exports.getCoachProfiles = catchAsync(async (req, res) => {
    const coachList = await User.find({ isCoach: true })
    if (!coachList) {
        res.status(404).json({ status: "fail", message: "There are no coaches available" })
    }
    return res.status(200).json({ status: "Success", data: coachList })
})

//Get single coach profile
exports.getSingleCoach = catchAsync(async (req, res) => {
    const coach = await User.findOne({ _id: req.params.coachId })

    console.log("this one", req.params)

    if (coach.isCoach === false) {
        res.status(404).json({ status: "fail", message: "There is no coach profile associated with this user" })
    }
    return res.status(200).json({ status: "Success", data: coach })
})

//reset password with SendGrid
exports.resetPassword = catchAsync(async (req, res, next) => {
    try {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const user = await User.findOne({ email: req.params.email })

        if (!user)
            return res.status(400).json({
                status: "fail",
                data: "Nu user found"
            });

        const token = jwt.sign({ email: user.email },
            process.env.SECRET,
            { expiresIn: '15m' });

        const msg = {
            to: user.email,
            from: 'jurgis_g@hotmail.com',
            subject: 'Forgot password confirmation',
            html: `Click <a href="https://localhost:3000/email/${token}">this link</a> to reset your proFlyer user password`,
        };
        await sgMail.send(msg);
        return res.status(200).json({
            status: "success",
            data: "A confirmation will be sent to your email address"
        });

    } catch (err) {
        console.log(err.response.body.errors)
    }


})
//Change password with SendGrid
exports.changePassword = catchAsync(async (req, res, next) => {
    const { urlToken } = req.params
    const { password } = req.body
    const decoded = jwt.verify(urlToken, process.env.SECRET)

    const user = await User.findOne({ email: decoded.email })
    user.password = password
    user.save()

    res.status(201).json({ status: "Success", data: user })
})

//Change password in app
exports.changePW = async function (req, res) {
    try {
        const { passwordCurrent, password1 } = req.body;
        const user = await User.findById(req.user._id);

        if (!passwordCurrent && !password1) throw new Error("Current and new password are required")
        const match = await bcrypt.compare(passwordCurrent.toString(), user.password);
        console.log(match, passwordCurrent, user.password)
        if (!match) {
            throw new Error("Passwords do not match")
        };
        user.password = password1
        user.save()

        res.status(200).json({ status: "Success", data: user })
    } catch (err) {
        console.log(err)
        res.status(400).json({ status: "Password change failed", message: err.message })
    }
}