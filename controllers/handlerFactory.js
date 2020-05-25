const catchAsync = require("../utils/catchAsync")

// const AppError = require('../utils/appError')

exports.getAll = Model => catchAsync(async (req, res) => {

    switch (Model.modelName) {
        case "Camp":
            break;
    }
    const list = await Model.find({})
    res.status(200).json({ status: "Success", data: list })
})

exports.deleteOne = Model => catchAsync(async (req, res) => {
    let id;
    switch (Model.modelName) {
        case "User":
            id = req.user.id //if does not work try with params
            break;
        case "Camp":
            id = req.params.campID //if does not work try with params
            break;
        default:
            id = req.params.id
    }
    //specal conditionts can be set here
    // if(!id){
    //     next(new AppError(400,"Incorrect input"))
    // }
    await Model.findOneAndDelete({ _id: id })
    res.status(204).end()
});

exports.deleteMany = Model => catchAsync(async (req, res) => {
    let id;
    switch (Model.modelName) {
        case "Camp":
            id = req.params.campID
            break;
        default:
            id = req.params.id
    }
    await Model.deleteMany({ organizer: !id })
    res.status(204).end()
})

exports.updateOne = Model => catchAsync(async (req, res, next) => {

    let allows = []
    let id;
    switch (Model.modelName) {
        case "User":
            allows = [
                "name",
                "password",
                "avatar",
                "isCoach",
                "profile",
                "profile.bio",
                "profile.location",
                "profile.company",
                "profile.disciplines",
                "profile.numberOfJumps",
                "profile.tunnelHours",
                "profile.yearsInSport",
                "profile.social.youtube",
                "profile.social.twitter",
                "profile.social.facebook",
                "profile.social.instagram"
            ]
            id = req.user._id
            break;

        case "Camp":
            console.log("BOOOOM", req.params.cardID)
            allows = [
                "title",
                "img",
                "description",
                "price",
                "disciplines",
                "groupSize",
                "availability"
            ]
            id = req.params.campID
            break;

        default:
            allows = [];
            id = req.params.id
    }


    // return array of fields inside req.body
    Object.keys(req.body).forEach(el => {
        if (!allows.includes(el)) {
            delete req.body[el]
        }
    });

    const item = await Model.findOneAndUpdate({ _id: id }, req.body, { new: true })

    res.status(200).json({ status: "ok", data: item })

})
