const User = require("../models/User");
// const Profile = require("../models/Profile");
const gravatar = require('gravatar');
const catchAsync = require("../utils/catchAsync")

//Delete a user
const { deleteOne } = require("./handlerFactory");
exports.deleteUser = deleteOne(User);

const { updateOne } = require("./handlerFactory");
exports.updateUser = updateOne(User)

exports.registerUser = async (req, res) => {
    const { name, email, password, isCoach } = req.body
    try {
        const avatar = gravatar.url(email, {
            s: '200',//size
            r: 'pg',//rating
            d: 'mm'
        }, true)
        const user = await User.create({ name, email, password, avatar, isCoach })
        const token = user.generateToken();
        res.status(201).json({ status: "Success", data: { user, token } })
    } catch (err) {
        console.log(err)
        res.status(400).json({ status: "Fail", data: null })
    }
};

exports.getUserProfile = catchAsync(async (req, res) => {

    const profile = await User.find({ id: req.user.id })
        .populate('User', ['name', 'avatar'])
    if (!profile) {
        res.status(404).json({ status: "fail", message: "There is no profile for this user" })
    }
    return res.status(200).json({ status: "Success", data: profile })
})

// list of all coaches
exports.getCoachProfiles = catchAsync(async (req, res) => {
    const coachList = await User.find({ isCoach: true })
    if (!coachList) {
        res.status(404).json({ status: "fail", message: "There are no coaches available" })
    }
    return res.status(200).json({ status: "Success", data: coachList })
})

exports.getSingleCoach = catchAsync(async (req, res) => {
    const coach = await User.findOne({ _id: req.params.id })

    console.log("masterrrr", coach)


    if (coach.isCoach === false) {
        res.status(404).json({ status: "fail", message: "There is no coach profile associated with this user" })
    }
    return res.status(200).json({ status: "Success", data: coach })
})