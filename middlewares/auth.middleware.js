const jwt = require("jsonwebtoken");

const AuthMiddleware = async (req, res, next) => {
  if (req.headers.authorization == null) {
    res.status(404).json({
      message: "inside headers please provide any authorization",
    });
    return;
  }
  const token = req.headers.authorization.split(" ")[1];
  try {
    if (token) {
      jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
          res.status(500).json({
            message: "internal error occured by jwt",
          });
        }
        if (decoded) {
          req.body.username = decoded.username;
          req.body.role = decoded.role;
          next();
        }
      });
    } else {
      res.status(409).json({
        message: "access dennied unathorized entry identify",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "error occured during user authentication",
    });
  }
};

module.exports = AuthMiddleware;
