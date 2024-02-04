const userRoute = require("express").Router();
const auth=require('../middleware/auth')
const adminRole=require('../middleware/adminRoute')
const {
  readAll,
  readSingle,
  updateUser,
  deleteUser,
} = require("../controller/userController");

userRoute.get("/all",auth ,readAll).get("/single/:id",adminRole , readSingle);

userRoute.patch("/update/:id",adminRole , updateUser);

userRoute.delete("/delete/:id",adminRole , deleteUser);

module.exports = userRoute;
