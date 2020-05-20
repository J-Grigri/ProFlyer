const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const User = require("./User");


const campSchema = new Schema({
    organizer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Tour must have an user"],
    },
    title: {
        type: String,
        required: [true, "User must have a name"],
        trim: true,
    },
    img: {
        type: String,//CHANGE AFTER TESTING
    },
    description: {
        type: String,
        required: true,
        minLength: 10
    },
    price: {
        type: Number,
        required: [true, "Camp must have a price"],
        min: [0, "Camp price must be 0 or higher"]
    },
    disciplines: [
        {
            // type: mongoose.Schema.ObjectId,
            // ref: "Category",
            // require: [true, "Tour must have at least one category"]
        }
    ],
    isSkydiveCamp: {
        type: Boolean,
        required: [true, "Select camp type"],

    },
    groupSize: {
        type: Number,
        required: [true, "Camp must have a group size"],
        min: [1, "Group size must be greater than 1"]
    },
    availability: {
        type: Number,
        required: [true, "Please indicate number of available spots in the camp"],
        min: [0, "Minimum of one free spot"]
    },
}, {
    timestamps: true,//createdAt and editedAt
    toJSON: { virtuals: true },//data which are not stored directly in our database(e.g. firstName+lastName)
    toObject: { virtuals: true }//raw object from an instance of a class (model) without additional keys,
})


const Camp = mongoose.model("Camp", campSchema);
module.exports = Camp;