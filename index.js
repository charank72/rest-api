const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { StatusCodes } = require("http-status-codes");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT;
const connectDb = require("./db/connect");
const path = require("path");

const expressFileUpload = require("express-fileupload");
//instance route

const app = express();

//body parser
app.use(express.urlencoded({ extended: false })); //query format
app.use(express.json()); //json format
//public dir as static

app.use(express.static("public"));
app.use(express.static("build"));
//middleware

app.use(cors());
app.use(cookieParser(process.env.ACCESS_SECRET));
app.use(
  expressFileUpload({
    limits: { fileSize: 10 * 1024 * 1024 },
    useTempFiles: true,
  })
);

if (process.env.SERVER === "production") {
  // executes in production mode
  app.use(`/`, (req, res, next) => {
    return res.sendFile(path.resolve(__dirname, `./build/index.html`));
    next();
  });
}

//api route
app.use("/api/auth", require("./route/authRoute"));
app.use("/api/file", require("./route/fileRoute"));
app.use("/api/user", require("./route/userRoute"));

//default path

app.use("**", (req, res) => {
  res
    .status(StatusCodes.SERVICE_UNAVAILABLE)
    .json({ msg: `Requested service path not found`, success: false });
});

//aerver listen
app.listen(PORT, () => {
  connectDb(); //connecting mongo
  console.log(`server is started and running at @ http://localhost:${PORT}`);
});
