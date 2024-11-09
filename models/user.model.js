const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      minLength: [3, "must contains atleast 3 charecters"],
      required: true,
    },
    age: {
      type: Number,
      min: [18, "must be greater than or equal to 18"],
      max: [65, "must be less than or equal to 65"],
      required: true,
    },
    email: {
      type: String,
      match:
        /[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/,
      required: true,
    },
    password: {
      type: String,
      match: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6}/,
      required: true,
    },
    mobile: { type: Number, match: /^[0-9]{10}/, required: false },
    role: {
      type: String,
      default: "user",
      enum: {
        values: ["admin", "user"],
        message: "{VALUE} should be admin or user only",
      },
    },
  },
  { versionKey: false }
);

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
