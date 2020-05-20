const router = require('express').Router()
const { auth } = require('../controllers/authController')

const {
    createCamp,
    getCamps,
    getUserCamps,
    updateCamp,
    deleteCamp
} = require("../controllers/campController")

router
    .route('/organize/my-camps/:campID')
    .put(auth, updateCamp)
    .delete(auth, deleteCamp)

router
    .route('/organize/my-camps')
    .get(auth, getUserCamps)

router
    .route('/organize')
    .post(auth, createCamp)


//PUBLIC ROUTE
router
    .route('/')
    .get(getCamps)

module.exports = router;