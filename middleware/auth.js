//decrypt the user id from auth token received by header authorization

const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

//reads the token from headers auth
const auth = async (req, res, next) => {
  try {
    let token = req.header("Authorization");
    if (!token)
      return res.status(StatusCodes.NOT_FOUND).json({ msg: `token not found`,success:false  });

    //verifiying token

    await jwt.verify(token, process.env.ACCESS_SECRET, (err, data) => {
      if (err)
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ msg: `unauthorized token `,success:false  });

      // res.json({data})
      req.userId = data.id;
      //continue to next controller
      next();
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err,success:false  });
  }
};

module.exports = auth;
