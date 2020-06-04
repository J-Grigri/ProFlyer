const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const User = require("./User");


const campSchema = new Schema({
    organizer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Camp must have an organizer"],
    },
    title: {
        type: String,
        required: [true, "Camp must have a title"],
        trim: true,
    },
    startDate: {
        type: String,
    },
    endDate: {
        type: String,
    },
    img: {
        type: String,//CHANGE AFTER TESTING
    },
    description: {
        type: String,
        // required: true,
        minLength: 10
    },
    price: {
        type: Number,
        // required: [true, "Camp must have a price"],
        min: [0, "Camp price must be 0 or higher"]
    },
    disciplines: {
        type: String
    },
    venue: {
        type: String,
        required: [true, "Camp must have a venue"]
    },
    isSkydiveCamp: {
        type: Boolean,
        // required: [true, "Camp type is required"],
    },

    isTunnelCamp: {
        type: Boolean,
        // required: [true, "Camp type is required"],
    },
    groupSize: {
        type: Number,
        // required: [true, "Camp must have a group size"],
        min: [1, "Group size must be greater than 1"]
    },
    availability: {
        type: Number,
        // required: [true, "Please indicate number of available spots in the camp"],
        min: [0, "Minimum of one free spot"]
    },
}, {
    timestamps: true,//createdAt and editedAt
    toJSON: { virtuals: true },//data which are not stored directly in our database(e.g. firstName+lastName)
    toObject: { virtuals: true }//raw object from an instance of a class (model) without additional keys,
})

campSchema.pre(/^find/, async function (next) {
    this.populate("organizer")
    next()
})

const Camp = mongoose.model("Camp", campSchema);
module.exports = Camp;