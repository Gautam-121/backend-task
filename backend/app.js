const express = require("express")
const app = express()
const errorMiddleware = require("./middleware/errorMiddleware.js")

app.use(express.json())

//import Router
const customerRouter = require("./route/customerRouter.js")

app.use("/api/v1" , customerRouter)

//import errorMiddleware
app.use(errorMiddleware)



module.exports = app