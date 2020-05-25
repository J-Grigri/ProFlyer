const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

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
    avatar: {
        type: String
    },
    tokens: [{
        type: String
    }],
    profile: {
        bio: {
            type: String
        },
        location: {
            type: String
        },
        company: {
            type: String
        },
        disciplines: {
            type: [String]
        },
        numberOfJumps: {
            type: Number
        },
        tunnelHours: {
            type: Number
        },
        yearsInSport: {
            type: Number
        },
        social: {
            youtube: {
                type: String
            },
            twitter: {
                type: String
            },
            facebook: {
                type: String
            },
            instagram: {
                type: String
            }
        },
    }
}, {
    // add createdAt and updatedAt from mongoose
    timestamps: true,
    toJSON: { virtuals: true },//data which are not stored directly in our database(e.g. firstNam+lastName)
    toObject: { virtuals: true }//raw object from an instance of a class (model) without additional keys
});

//modify the response for User model
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.__v;//tracks how many times document has been changed
    delete userObject.createdAt;
    delete userObject.updatedAt;

    return userObject;
}

//encrypt password before storing it
const saltRounds = 10;//hash algorythm complexity
userSchema.pre("save", async function (next) { //this here = doc
    //make sure that password field is modified (or created). If not, skip
    if (!this.isModified("password")) return next();
    //hash the password
    this.password = await bcrypt.hash(this.password, saltRounds);
    console.log(this)
    next()
});

//Compare password && hashed password and initiate login
userSchema.statics.loginWithEmail = async (email, password) => {

    const user = await User.findOne({ email: email })

    if (!user) {
        throw new Error("Unable to login")
    };
    //compare the password
    const match = await bcrypt.compare(password.toString(), user.password);
    if (!match) {
        throw new Error("Unable to login")
    };
    return user
}

//Issue a JWT token on successful login
userSchema.methods.generateToken = async function () {
    const user = this;
    const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: '7d' });
    //save in the db
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