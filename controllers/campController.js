const Camp = require('../models/Camp')
const catchAsync = require('../utils/catchAsync')


const { getAll } = require("./handlerFactory");
exports.getCamps = getAll(Camp)

const { updateOne } = require("./handlerFactory")
exports.updateCamp = updateOne(Camp)

const { deleteOne } = require("./handlerFactory")
exports.deleteCamp = deleteOne(Camp)

exports.getUserCamps = catchAsync(async (req, res) => {
    console.log("This one", req.user.id)
    const userCamps = await Camp.find({ organizer: req.user.id })
    res.status(200).json({ status: "Success", data: userCamps })
})

exports.createCamp = catchAsync(async function (req, res, next) {
    const organizer = req.user._id
    const {
        isSkydiveCamp,
        isTunnelCamp,
        disciplines,
        title,
        venue,
        startDate,
        endDate,
        groupSize,
        description,
        price,
    } = req.body

    const camp = await Camp.create({
        organizer,
        isSkydiveCamp,
        isTunnelCamp,
        disciplines,
        title,
        venue,
        startDate,
        endDate,
        groupSize,
        description,
        price,
    })
    return res.status(201).json({ status: "Success", data: camp })
})