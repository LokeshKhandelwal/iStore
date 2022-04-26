const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    //Wrong Mongodb Id order
    if (err.name === "CastError") {
        const message = `Resource Not Found Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400)
    }

    //Mongoose Duplicate Key Error
    if (err.code == 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
        err = new ErrorHandler(message, 400)
    }
    //JWT Key Error
    if (err.code == "JsonWebTokenError") {
        const message = `json web token is invalid try again`
        err = new ErrorHandler(message, 400)
    }
    //jwt expire error
    if (err.code == "TokenExpiredError") {
        const message = `json web token is Expire, try again`
        err = new ErrorHandler(message, 400)
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
};
