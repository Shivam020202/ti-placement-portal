const { HttpError } = require("../config/http.js");

const errorMiddleware = (err, req, res, next) => {
    if (err instanceof HttpError) {

    } else {
        console.log(err.message)
        // err = new HttpError(500, "Internal Server Error", err.stack);
    }
    res.status(err.statusCode || 500).json({reason: err.message, stack: process.env.NODE_ENV === 'development' ? err.stack: '🥞'});
}

module.exports = errorMiddleware;