const { StatusCodes } = require("http-status-codes")

const authController={
  register:async(req,res)=>{
    try{
      res.join({msg:`register`})
    }catch(err){
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:err.message})
    }
  },


  login:async(req,res)=>{
    try{
      res.join({msg:`login`})
    }catch(err){
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:err.message})
    }
  },


  logout:async(req,res)=>{
    try{
      res.join({msg:`logout`})
    }catch(err){
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:err.message})
    }
  },


  authToken:async(req,res)=>{
    try{
      res.join({msg:`auth token`})
    }catch(err){
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:err.message})
    }
  },


  currentUsers:async(req,res)=>{
    try{
      res.join({msg:`current user`})
    }catch(err){
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:err.message})
    }
  }

}
module.exports =authController