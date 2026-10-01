const authMiddleware = (req, res, next) => {
    console.log("Middleware is running");

    next();
};

module.exports = authMiddleware;