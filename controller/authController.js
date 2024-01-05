const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const User = require("../model/userModel");
const comparePassword = require("../utility/password");
const createAccessToken = require("../utility/token");
const jwt = require("jsonwebtoken");
const reset_password = require("../template/gen_pass");
const mailConfig = require(`../utility/mailconfig`);

const authController = {
  register: async (req, res) => {
    try {
      const { name, email, mobile, password } = req.body;

      //email
      const extEmail = await User.findOne({ email });
      const extMobile = await User.findOne({ mobile });

      //points the duplicate,any server reseponse erroe 409
      if (extEmail)
        return res
          .status(StatusCodes.CONFLICT)
          .json({ msg: `${email} already exsists` });

      if (extMobile)
        return res
          .status(StatusCodes.CONFLICT)
          .json({ msg: `${mobile} already exsists` });

      const encPass = await bcrypt.hash(password, 10); //encrypts the password into hash

      let data = await User.create({
        name,
        email,
        mobile,
        password: encPass,
      });

      res
        .status(StatusCodes.ACCEPTED)
        .json({ msg: "New user registered succesfully", user: data });
    } catch (err) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, mobile, password } = req.body;

      //if login through email
      if (email) {
        let extEmail = await User.findOne({ email });
        if (!extEmail)
          return res
            .status(StatusCodes.CONFLICT)
            .json({ msg: `${email} is not registered` });

        //comparing the password(string,hash)
        let isMatch = await comparePassword(password, extEmail.password);
        if (!isMatch)
          return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ msg: `password not matched` });
        let authToken = createAccessToken({ id: extEmail._id });
        //set the token in cookies

        res.cookie("loginToken", authToken, {
          httpOnly: true,
          signed: true,
          path: "/api/auth/token",
          maxAge: 1 * 24 * 60 * 60 * 1000,
        });
        res
          .status(StatusCodes.OK)
          .json({ msg: `login success(with email)`, authToken });
      }
      //if login through mobile
      if (mobile) {
        let extMobile = await User.findOne({ mobile });
        if (!extMobile)
          return res
            .status(StatusCodes.CONFLICT)
            .json({ msg: `${mobile} number doesnt exsist` });

        //compare the password
        let isMatch = await comparePassword(password, extMobile.password);
        if (!isMatch)
          return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ msg: `passwords not matched` });
        let authToken = createAccessToken({ id: extMobile._id });
        //set the token in cookies

        res.cookie("loginToken", authToken, {
          httpOnly: true,
          signed: true,
          path: "/api/auth/token",
          maxAge: 1 * 24 * 60 * 60 * 1000,
        });

        res
          .status(StatusCodes.OK)
          .json({ msg: `login success(with mobile)`, authToken });
      }
    } catch (err) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: err.message });
    }
  },

  logout: async (req, res) => {
    try {
      //clear cookies

      res.clearCookie("loginToken", { path: `/api/auth/token` });

      res.status(StatusCodes.OK).json({ msg: `logout succesfull` });
    } catch (err) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: err.message });
    }
  },

  authToken: async (req, res) => {
    try {
      //need to read to read login token from signed cookie
      const rToken = req.signedCookies.loginToken;

      if (!rToken)
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ msg: `token not available` });

      //validate user id or not

      await jwt.verify(rToken, process.env.ACCESS_SECRET, (err, user) => {
        if (err)
          return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ msg: `Unauthorized login` });

        //if valid
        res.status(StatusCodes.OK).json({ authToken: rToken });
      });
    } catch (err) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: err.message });
    }
  },

  currentUsers: async (req, res) => {
    try {
      let single = await User.findById({ _id: req.userId }).select("-password");
      if (!single)
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ msg: `user info not found` });
      res.status(StatusCodes.ACCEPTED).json({ user: single });
      // res.json({ user: single });
    } catch (err) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: err.message });
    }
  },
  verifyUser: async (req, res) => {
    try {
      let { email } = req.body;

      let extEmail = await User.findOne({ email });
      if (!extEmail)
        return res
          .status(StatusCodes.CONFLICT)
          .json({ msg: `${email} doesn't exists`, status: false });
      res
        .status(StatusCodes.ACCEPTED)
        .json({ msg: `email id verified succesfully`, status: true });
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
    }
  },

  updatePassword: async (req, res) => {
    try {
      let id = req.userId;
      let { password } = req.body;

      let extUser = await User.findById({ id: id });

      if (!extUser)
        return res
          .status(StatusCodes.CONFLICT)
          .json({ msg: "Requested user info not exsists" });

      //encrypt the password

      const encPass = await bcrypt.hash(password, 10);

      //update the password
      await User.findByIdAndUpdate({ _id:id}, { password: encPass });

      return res
        .status(StatusCodes.ACCEPTED)
        .json({ msg: `password succesfully updated` });
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
    }
  },
  passwordLink: async (req, res) => {
    try {
      let { email } = req.body;

      let extEmail = await User.findOne({ email });
      if (!extEmail)
        return res
          .status(StatusCodes.CONFLICT)
          .json({ msg: `${email} doesn't exists`, status: false });

      //password token

      let passToken = await createAccessToken({ id: extEmail._id });

      //password reseet template

      let passTemplate = reset_password(extEmail.name, email, passToken);

      let subject = "Reset your password";

      //send email
      let emailRes = await mailConfig(email, subject, passTemplate);
      res
        .status(StatusCodes.ACCEPTED)
        .json({ msg: `password link succesfully sent`, status: emailRes });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
    }
  },
};

module.exports = authController;
//npm cache clean --force
