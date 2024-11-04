const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const AuthMiddleware = require("../middlewares/auth.middleware");
const RoleBaseAuthMiddleware = require("../middlewares/role.base.middleware");
const userRoute = express.Router();

userRoute.post("/register", async (req, res) => {
  const { username, age, email, password, mobile, role } = req.body;
  const users = await userModel.findOne({ email: email });
  if (!username || !age || !email || !password || !mobile) {
    res.status(409).json({
      warning: "bad request provide require fields",
    });
    return;
  }
  if (role != "user" && role != "admin") {
    res.status(409).json({
      warning: "bad request you can register with role [user,admin]",
    });
    return;
  }
  const admin = await userModel.findOne({ role: "admin" });

  try {
    if (!users || users == null) {
      if (admin) {
        if (role == "admin") {
          res.status(410).json({
            warning: `You are not authorized for this role !`,
          });
          return;
        }
      }
      bcrypt.hash(password, 3, async (err, hash) => {
        try {
          if (err) {
            res.status(500).json({
              error: "internal server error by bcrypt try again",
            });
            return;
          }
          const newUser = new userModel({
            username,
            age,
            email,
            password: hash,
            mobile,
            role,
          });
          await newUser.save();
          res.status(200).json({
            message: "user added successfully",
          });
        } catch (error) {
          console.log(error);
        }
      });
    } else {
      res.status(409).json({
        warning: `user already exist`,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: `internal error occured during register err : ${error}`,
    });
  }
});

userRoute.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(409).json({
      warning: `bad request provide require fields`,
    });
    return;
  }
  try {
    const users = await userModel.findOne({ email: email });
    if (!users || users == null) {
      res.status(404).json({
        message: "invalid credientials please check",
      });
      return;
    }
    bcrypt.compare(password, users.password, (err, result) => {
      if (err) {
        res.status(500).json({
          message: "error occured by bcrypt try again",
        });
      }
      if (result) {
        jwt.sign(
          { username: users.username, role: users.role },
          process.env.SECRET_KEY,
          { expiresIn: "1h" },
          (err, token) => {
            if (err) {
              res.status(509).json({
                message: "internal server error occured by jwt try later",
              });
              return;
            }
            res.status(200).json({
              message: "user login successfully",
              token: token,
            });
          }
        );
      } else {
        res.status(200).json({
          message: "invalid password",
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: `internal error occured during login err : ${error}`,
    });
  }
});

userRoute.get(
  "/allusers",
  [AuthMiddleware, RoleBaseAuthMiddleware],
  async (req, res) => {
    const { q, sort } = req.query;
    const query = {};
    const options = {};
    if (q) {
      query.username = new RegExp(q, "i");
    }
    if (sort) {
      options.sort = { age: sort == "asc" ? 1 : -1 };
    }
    try {
      const users = await userModel.find(query, null, options);
      if (users.length == 0 || users == null) {
        res.status(404).json({
          message: `users not found`,
        });
      } else {
        res.status(200).json({
          users: users,
        });
      }
    } catch (error) {
      res.status(509).json({
        message: "error occured during fetching users",
        error: error,
      });
    }
  }
);

module.exports = userRoute;
