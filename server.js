const express = require('express')
const router = express.Router();
const app = express();
const mongoose = require("mongoose");

require("dotenv").config({ path: ".env" });

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


router.get('/', (req, res) => res.send("API running"))
//all routers
router.use("/users", require('./routers/userRouter'))
router.use("/auth", require('./routers/authRouter'))
// router.use("/profile", require('./routers/profile'))
router.use("/camps", require('./routers/campRouter'))


// error middleware that will capture errors from 404 handler
const errorHandler = require('./utils/errorHandler')
app.use(errorHandler)

const AppError = require('./utils/appError')


const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
