const express = require('express')
const router = express.Router();
const app = express();
const mongoose = require("mongoose");
const passport = require("./auth/index");

require("dotenv").config({ path: ".env" });
const cors = require("cors")
app.use(cors())
mongoose.connect(process.env.DB_LOCAL, {
    // some options to deal with deprecated warning, you don't have to worry about them.
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log("connected to database"))

const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// use router
app.use(router);
app.use(passport.initialize());

router.get('/', (req, res) => res.send("API running"))
//all routers
router.use("/auth", require('./routers/authRouter'))
router.use("/users", require('./routers/userRouter'))
router.use("/camps", require('./routers/campRouter'))
router.use("/disciplines", require('./routers/disciplinesRouter'))


// error middleware that will capture errors from 404 handler
const errorHandler = require('./utils/errorHandler')
app.use(errorHandler)

const AppError = require('./utils/appError')

module.exports = app