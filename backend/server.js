const app = require('./app')//app.js se express lenge
const dotenv = require("dotenv")//pata chale ki config.env ke aandar kya hain
const connectDatabase = require('./config/database');

//Handling Uncaught Exception--unknown term use
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log("shutting down the server due to Uncaught Exception");
    process.exit(1);
})


//config
dotenv.config({path:"./config.env"})

//Connecting with database by calling function
connectDatabase();

//server chalna chaiya
const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is Working on http://localhost:${process.env.PORT}`)
})

//  console.log(YOJoginder)
//Unhandled Promise rejection--if dabase is wrong (try catch)
process.on("unhandledRejection",err=>{
    console.log(`Error: ${err.message}`)
    console.log(`shutting down the server due to Unhandled Promise Reection`)

    server.close(()=>{
        process.exit(1);
    })
})
