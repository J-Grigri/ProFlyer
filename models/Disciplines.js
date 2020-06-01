const mongoose = require("mongoose")

const disciplineSchema = mongoose.Schema({
    discipline: {
        type: String,
        required: [true, "Discipline name is required"],
        trim: true,
        unique: true,
    }
})
const Disciplines = mongoose.model("Disciplines", disciplineSchema)
module.exports = Disciplines

