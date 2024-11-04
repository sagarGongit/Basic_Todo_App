const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    priority: {
      type: Number,
      enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      default: 8,
    },
    description: { type: String, required: true },
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
