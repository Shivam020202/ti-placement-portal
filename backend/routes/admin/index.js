const express = require("express");
const companyRouter = require("./company");
const adminRouter = express.Router();

adminRouter.use('/company', companyRouter)

adminRouter.get("/", (req, res) => {
    res.send("Welcome to the admin API");
})

module.exports = adminRouter;