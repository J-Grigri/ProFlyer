const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const Disciplines = require("./Disciplines")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        minLength: 3,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        trip: true,
        lowercase: true,
        validate(val) {
            if (!validator.isEmail(val)) {
                throw new Error("Invalid email address");
            }
        }
    },
    password: {
        type: String,
        required: [true, "Password must be at least 6 characters longgggggg"],
        // minLength: 6
    },
    isCoach: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    tokens: [{
        type: String
    }],
    profile: {
        avatar: {
            type: String,
            default: ""

        },
        location: {
            type: String,
            default: ""

        },
        disciplines: {
            type: mongoose.Schema.ObjectId,
            ref: "Disciplines",
        },
        skydiveLicence: {
            type: String,
            default: ""

        },
        tunnelHours: {
            type: String,
            default: ""

        },
        social: {
            youtube: {
                type: String,
                default: ""

            },
            twitter: {
                type: String,
                default: ""

            },
            facebook: {
                type: String,
                default: ""

            },
            instagram: {
                type: String,
                default: ""

            }
        },
    },
    coach: {
        bio: {
            type: String,
            default: ""
        },
        inSportSince: {
            type: Date,
            default: ""

        },
        experience: {
            type: String,
            default: ""

        },
        certifications: {
            type: String,
            default: ""

        },
        achievments: {
            type: String,
            default: ""

        },
        disciplines: {
            type: String,
            default: ""

        },
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },//data which are not stored directly in our database(e.g. firstNam+lastName)
    toObject: { virtuals: true }//raw object from an instance of a class (model) without additional keys
});

//modify the response for User model
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.__v;
    delete userObject.createdAt;
    delete userObject.updatedAt;

    return userObject;
    console.log("userObject from User model", userObject)
}

//encrypt password before storing 
const saltRounds = 10;
userSchema.pre("save", async function (next) { //this here = doc
    //make sure that password field is modified (or created). If not, skip
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, saltRounds);
    console.log("***", this)
    next()
});

//Compare password && hashed password and initiate login
userSchema.statics.loginWithEmail = async (email, password) => {

    const user = await User.findOne({ email: email })
    if (!user) {
        throw new Error("Unable to login")
    };
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw new Error("Unable to login")
    };
    return user
}

//Issue a JWT token on successful login
userSchema.methods.generateToken = async function () {
    const user = this;
    const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: '7d' });

    user.tokens.push(token);
    await user.save({ validateBeforeSave: false });
    return token;
    console.log(token)
};
//Create or query the user and generate token:
userSchema.statics.findOneOrCreate = async function (email, name) {
    let found = await this.findOne({ email: email });
    if (!found) {
        found = new this({ email: email, name: name });
    }
    found.token = await found.generateToken();
    console.log(found)
    return found;
};

const User = mongoose.model("User", userSchema);
module.exports = User;