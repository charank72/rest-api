const { StatusCodes } = require("http-status-codes");
const FileSchema = require("../model/fileModel");
const User = require("../model/userModel");
const path = require("path");
const fs = require("fs");
const fileType = require("../utility/fileType");
//remove files
const removeTemp = (filepath) => {
  fs.unlinkSync(filepath);
};

const uploadFile = async (req, res) => {
  try {
    const { product } = req.files;
    // let fileExt=path.extname()/*  */

    const id = req.userId;
    //check the folder if not exsist create the folder
    /*  const outPath =path.json(__dirname,'../public')
    if(!fs.existsSync(outPath)){
      fs.mkdirSync(outPath,{recursive:true})
    } */

    //no files are attached
    if (!req.files)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "no file to upload" });
    //fetch user info
    let extUser = await User.findById({ _id: id }).select("-password");
    //if user id not found
    if (!extUser) {
      removeTemp(product.tempFilePath);
      return res.status(StatusCodes.CONFLICT).json({ msg: "not found" });
    }
    //validate the file ext

    if (
      product.mimetype === fileType.jpg ||
      product.mimetype === fileType.pptx ||
      product.mimetype === fileType.pdf ||
      product.mimetype === fileType.png ||
      product.mimetype === fileType.mp3 ||
      product.mimetype === fileType.mp4
    ) {
      //rename the file
      let ext = path.extname(product.name);
      let fileName = `doc-${Date.now()} ${ext}`;
      //store the file in physical location
      await product.mv(
        path.resolve(__dirname, `../public/${fileName}`),
        async (err) => {
          if (err) {
            removeTemp(product.tempFilePath);
            return res.status(StatusCodes.CONFLICT).json({ msg: err });
          }
          //adds file to the colection file
          let fileRes = await FileSchema.create({
            userId: extUser._id,
            newName: fileName,
            user: extUser,
            info: product,
          });
          //final response
          res
            .status(StatusCodes.ACCEPTED)
            .json({ msg: "file uploaded succesfully", files: fileRes });
        }
      );
    } else {
      removeTemp(req.files.product.tempFilePath);
      return res
        .status(StatusCodes.CONFLICT)
        .json({ msg: "upload only png or jpeg" });
    }
  } catch (err) {
    removeTemp(req.files.product.tempFilePath);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};

//read all -get
const readAll = async (req, res) => {
  try {
    let files = await FileSchema.find({});
    // let filteredFiles=files.filter((item)=>item.user._id===req.userId)
    let filtered = files.filter((item) => item.userId === req.userId);
    res.status(StatusCodes.OK).json({ length: files.length, files: filtered });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};
//read single=get+ref

const readSingle = async (req, res) => {
  try {
    let fileId = req.params.id;
    let userId = req.userId;

    let extFile = await FileSchema.findById({ _id: fileId });
    if (!extFile)
      return res
        .status(StatusCodes.CONFLICT)
        .json({ msg: "requested id not found" });

    //if file belongs to authorized user or not
    if (userId !== extFile.userId)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "unauthorized file read" });
    res.status(StatusCodes.ACCEPTED).json({ file:extFile });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};

//delete
const deleteFile = async (req, res) => {
  try {
    let fileId = req.params.id;
    let userId = req.userId;

    let extFile = await FileSchema.findById({ _id: fileId });
    if (!extFile)
      return res
        .status(StatusCodes.CONFLICT)
        .json({ msg: "requested id not found" });

    //if file belongs to authorized user or not
    if (userId !== extFile.userId)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "unauthorized file read" });

    ///delete physical file from directory
    let filePath=path.resolve(__dirname,`../public/${extFile.newName}`)

    if(fs.existsSync(filePath)){
      //to delete the file
      await fs.unlinkSync(filePath)
      //to delete in db
      await FileSchema.findByIdAndDelete({_id:extFile._id})

      return res.status(StatusCodes.ACCEPTED).json({msg:"file deleteed succcesfully"})
    }else{
      return res.json({msg:"file not exsists"})
    }

    // res.status(StatusCodes.ACCEPTED).json({ file:extFile });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};

module.exports = { uploadFile, readAll, deleteFile, readSingle };
