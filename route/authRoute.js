const authController=require('../controller/authController')
const auth = require('../middleware/auth')

const route= require('express').Router()

route.post(`/register`,authController.register)


route.post('/login',authController.login)


route.get('/logout',authController.logout)


route.get('/token',authController.authToken)


route.get('/current/user',auth,authController.currentUsers)


route.post('/verify/user',authController.verifyUser)

route.post('/generate/password/link',authController.passwordLink)



route.patch(`/password/update`,auth,authController.updatePassword)
module.exports=route