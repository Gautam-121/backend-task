const express = require("express")
const router = express.Router()
const {customerRegister} = require("../controller/customerController.js")

//User--Register --Identify
router.route("/identify").post(customerRegister)



module.exports = router