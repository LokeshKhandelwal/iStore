const express = require('express')
const app = express()

const errorMiddleware = require("./middleware/error") 

app.use(express.json());//basic enviorment 
// app.get('/', (req, res) => {res.send('hello world') })[To remove this we use routes(import)]
const product = require('./routes/productRoute');
app.use("/api/v1",product)

//Middleware for error
app.use(errorMiddleware);


module.exports= app;