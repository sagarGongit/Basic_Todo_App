const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      minLength: [5, "must contains more than 5 charecters"],
      required: true,
    },
    priority: {
      type: Number,
      match: /^[0-10]{2}/,
      default: 8,
    },
    description: {
      type: String,
      minLength: [20, "must be contains 20 charecters"],
      maxLength: [200, "should be contains 200 charecters"],
      required: true,
    },
    due_date: { type: Date, required: true },
    isCompleted: { type: Boolean, default: false, enum: [true, false] },
    assignee: {
      type: mongoose.Schema.Types.String,
      ref: "users",
      required: false,
    },
    completed_date: { type: Date, required: false },
  },
  { versionKey: false }
);

const todoModel = mongoose.model("todo", todoSchema);

module.exports = todoModel;
