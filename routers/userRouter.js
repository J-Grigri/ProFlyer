const router = require('express').Router()
const { auth } = require("../controllers/authController")
const {
    registerUser,
    getUser,
    deleteUser,
    updateUser,
    changePW,
    getCoachProfiles,
    getSingleCoach,
    resetPassword,
    changePassword
} = require("../controllers/userController")

router
    .route('/')
    .post(registerUser)

router
    .route('/me')
    .get(auth, getUser)
    .put(auth, updateUser)
    .delete(auth, deleteUser)

router
    .route('/me/password')
    .put(auth, changePW)

router
    .route('/coaches/:id')
    .get(auth, getSingleCoach)

router
    .route('/coaches')
    .get(getCoachProfiles)

//reset password
router.route("/forgot-password/:email").get(resetPassword)//send email with token
router.route("/change-password/:urlToken").post(changePassword)//receive new password

module.exports = router;