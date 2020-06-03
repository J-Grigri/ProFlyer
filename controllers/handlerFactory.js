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
    console.log(req.body)
    switch (Model.modelName) {
        case "User":
            allows = [
                "name",
                "profile.avatar",
                "profile.location",
                "profile.disciplines",
                "profile.skydiveLicence",
                "profile.tunnelHours",

                "profile.social.youtube",
                "profile.social.twitter",
                "profile.social.facebook",
                "profile.social.instagram",

                "coach.bio",
                "coach.inSportSince",
                "coach.certifications",
                "coach.achievements",
                "coach.experience",
                "coach.disciplines",
            ]
            id = req.user._id
            break;

        case "Camp":
            console.log("BOOOOM", req.params.cardID)
            allows = [
                "isSkydiveCamp",
                "isTunnelCamp",
                "disciplines",
                "title",
                "venue",
                "startDate",
                "endDate",
                "groupSize",
                "description",
                "price",
            ]
            id = req.params.campID
            break;

        default:
            allows = [];
            id = req.params.id
    }


    // return array of fields inside req.body
    Object.keys(req.body).forEach(el => {
        console.log(el, "keyname")
        if (!allows.includes(el)) {
            delete req.body[el]
        }
    });
    console.log(req.body, "dsadsadsadsa")
    const item = await Model.findOneAndUpdate({ _id: id }, req.body, { new: true })

    res.status(200).json({ status: "ok", data: item })

})
