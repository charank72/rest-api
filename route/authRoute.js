const authController=require('../controller/authController')

const route= require('express').Router()

route.post(`/register`,authController.register)


route.post('./login',authController.login)


route.get('/logout',authController.logout)


route.get('/auth/token',authController.authToken)


route.get('/current/user',authController.currentUsers)


module.exports=route