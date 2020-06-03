const AppError = require('./appError')


module.exports = func => (req, res, next) => func(req, res, next).catch(error => {
    console.log(error)
    return next(new AppError(400, error.message))
})
