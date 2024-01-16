const fileRoute = require("express").Router();
const auth = require("../middleware/auth");
const {
  uploadFile,
  readAll,
  readSingle,
  deleteFile,
  allFiles,filterType
} = require("../controller/fileController");

fileRoute.post("/upload", auth, uploadFile);

fileRoute.get("/all", auth, readAll);
fileRoute.get("/single/:id", auth, readSingle);

fileRoute.delete("/delete/:id", auth, deleteFile);


fileRoute.get("/open", allFiles);

fileRoute.get('/filter',auth,filterType)

module.exports = fileRoute;

