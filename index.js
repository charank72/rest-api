const express =require('express')
require('dotenv').config()
const cors=require('cors')
const { StatusCodes } = require("http-status-codes")
const cookieParser=require('cookie-parser')
const PORT=process.env.PORT
const connectDb=require('./db/connect')
//instance

const app=express()

//body parser
app.use(express.urlencoded({extended:false}))//query format
app.use(express.json())//json format

//middleware

app.use(cors())
app.use(cookieParser(process.env.ACCESS_SECRET))

//app route
app.use('/api/auth',require('./route/authRoute'))

//default path

app.use('**',(req,res)=>{
  res.status(StatusCodes.SERVICE_UNAVAILABLE).json({msg:`Requested service path not found`})
})


//aerver listen
app.listen(PORT,()=>{
  connectDb()//connecting mongo
  console.log(`server is started and running at @ http://localhost:${PORT}`)
})