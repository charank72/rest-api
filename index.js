const express =require('express')
require('dotenv').config()
const cors=require('cors')
const { StatusCodes } = require("http-status-codes")
const cookieParser=require('cookie-parser')
const PORT=process.env.PORT

//instance

const app=express()

//body parser
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//middleware

app.use(cors())
app.use(cookieParser())

//default path

app.use('**',(req,res)=>{
  res.status(StatusCodes.SERVICE_UNAVAILABLE).json({msg:`Requested service path not found`})
})


//aerver listen
app.listen(PORT,()=>{
  console.log(`server is started and running at @ http://localhost:${PORT}`)
})