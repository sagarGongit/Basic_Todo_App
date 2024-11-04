const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    mobile: { type: Number, required: false, default: 91 },
    role: { type: String, default: "user", enum: ["admin", "user"] },
  },
  { versionKey: false }
);

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
