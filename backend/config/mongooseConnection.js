const mongoose = require("mongoose")

const connection = ()=>{

    mongoose.connect(process.env.DB_URL , {
        useNewUrlParser : true
    })
    .then(data => console.log("mongoDB is connected on" , data.connection.host))
    .catch((err)=> console.log(err))
}


module.exports = connection