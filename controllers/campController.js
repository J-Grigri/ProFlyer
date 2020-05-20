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
    const {
        organizer,
        title,
        img,
        description,
        price,
        disciplines,
        groupSize,
        availability
    } = req.body

    const camp = await Camp.create({
        organizer,
        title,
        img,
        description,
        price,
        disciplines,
        groupSize,
        availability
    })
    return res.status(201).json({ status: "Success", data: camp })

})