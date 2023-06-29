const app = require("./app.js")
const dotenv = require("dotenv")
const connection = require("./config/mongooseConnection.js")

//Handled UncaughtException Error
process.on("uncaughtException" , (error)=>{
    console.log(`Error is ${error}`)
    console.log(`Shutting Down server due to Uncaught Exception Error`)

    process.exit(1)
})

//Config Environmental directary
dotenv.config({path : "backend/config/.env"})

//Mongoose Connection
connection()

//Server listen || server connecting
const server = app.listen(process.env.PORT || 3000 ,()=>{
    console.log("Server is running on", process.env.PORT || 3000)
})

//Handling Unhandled Promise Rejection
process.on("unhandledRejection" , (error)=>{
    console.log(`Error is ${error}`)
    console.log(`Shutting Down server due to Unhandled Promise Rejection`)

    server.close(()=>{
        process.exit(1)
    })
})