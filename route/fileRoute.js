const fileRoute = require("express").Router();
const auth = require("../middleware/auth");
const {
  uploadFile,
  readAll,
  readSingle,
  deleteFile,
} = require("../controller/fileController");

fileRoute.post("/upload", auth, uploadFile);

fileRoute.get("/all", auth, readAll);
fileRoute.get("/single/:id", auth, readSingle);

fileRoute.delete("/delete/:id", auth, deleteFile);

module.exports = fileRoute;

