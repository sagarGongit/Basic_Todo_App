const express = require("express");
const todoModel = require("../models/todo.model");
const todoRouter = express.Router();

todoRouter.post("/add-todo", async (req, res) => {
  const {
    title,
    priority,
    description,
    due_date,
    isCompleted,
    completed_date,
  } = req.body;
  if (!title || !priority || !description || !due_date) {
    res.status(409).json({
      message: "please provide an required fields",
    });
    return;
  }
  if (!(priority >= 1 && priority <= 10)) {
    res.status(409).json({
      warning: "you can select priority in range in between [1-10]",
    });
    return;
  }
  const todos = await todoModel.findOne({ title: title });
  try {
    if (!todos || todos == null) {
      const newTodo = new todoModel({
        title,
        priority,
        description,
        due_date,
        isCompleted,
        assignee: req.body.username,
        completed_date,
      });
      await newTodo.save();
      res.status(200).json({
        message: "todo added successfully",
      });
    } else {
      res.status(409).json({
        message: "todo already exist",
      });
    }
  } catch (error) {
    res.status(509).json({
      message: `internal server error occured while adding todo err : ${error}`,
    });
  }
});

todoRouter.get("/get-todo", async (req, res) => {
  const username = req.body.username;
  const { filter, sort, limit, q, id } = req.query;
  let query = {};
  let options = {};

  //searching

  if (q) {
    query.title = new RegExp(q, "i");
  }
  if (id) {
    query._id = { _id: id };
  }
  // sorting

  if (sort) {
    options.sort = { priority: sort == "asc" ? 1 : -1 };
  }

  // filtering

  if (filter !== undefined) {
    query.isCompleted = filter === "true";
  }

  //limit
  if (limit) {
    options.limit = parseInt(limit, 10);
  }

  try {
    const role = req.body.role;
    const todo = await todoModel.find(query, null, options);
    if (role == "admin") {
      res.status(200).json({
        message: `todos fetched successfully`,
        todos: todo,
      });
      return;
    }
    const todos = await todoModel.find({ assignee: username });
    if (todos.length == 0 || todos == null) {
      res.status(404).json({
        message: `todos not found let's start with new todo`,
      });
    } else {
      res.status(200).json({
        message: "todos fetched successfully",
        todos: todos,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: `internal server err occured during fetching todos : ${error}`,
    });
  }
});

todoRouter.patch("/update-todo/:id", async (req, res) => {
  const id = req.params.id;
  const { title, priority, description, due_date, isCompleted } = req.body;
  const todos = await todoModel.findOne({ _id: id });
  try {
    if (todos || todos != null) {
      if (isCompleted == true) {
        todos.completed_date = Date.now();
      }
      await todoModel.updateOne(
        { _id: id },
        {
          $set: title,
          description,
          priority,
          due_date,
          isCompleted,
          completed_date: todos.completed_date,
        }
      );
      res.status(200).json("todo updated successfully");
    } else {
      res.status(404).json({
        message: `todo not found with id : ${id}`,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "internal server error occured while updating",
    });
  }
});

todoRouter.delete("/delete-todo/:id", async (req, res) => {
  const id = req.params.id;
  const todos = await todoModel.findOne({ _id: id });
  try {
    if (todos || todos != null) {
      await todoModel.deleteOne({ _id: id });
      res.status(200).json("todo deleted successfully");
    } else {
      res.status(404).json({
        message: `todo not found with id : ${id}`,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "internal server error occured while updating",
    });
  }
});

module.exports = todoRouter;
