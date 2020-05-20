class AppError extends Error {
    constructor(statusCode, message){
        super(message);

        this.statusCode = statusCode;
        this.message = message;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

        this.isOperation = true;//indicate that it s operational error so that we can customize it
        Error.captureStackTrace(this, this.constructor);//generates error stack
    }
}

module.exports = AppError;