const router = require('express').Router()
const { auth } = require("../controllers/authController")
const {
    registerUser,
    getUserProfile,
    deleteUser,
    updateUser,
    getCoachProfiles,
    getSingleCoach
} = require("../controllers/userController")

router
    .route('/')
    .post(registerUser)

router
    .route('/me')
    .get(auth, getUserProfile)
    .delete(auth, deleteUser)


router
    .route('/me/profile')
    .put(auth, updateUser)

router
    .route('/coaches/:id')
    .get(auth, getSingleCoach)

router
    .route('/coaches')
    .get(getCoachProfiles)

module.exports = router;