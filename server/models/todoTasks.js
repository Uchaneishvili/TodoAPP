const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  overline: {
    type: Boolean,
    required: true,
  },
});

const todoTasks = mongoose.model("tasks", taskSchema);
module.exports = todoTasks;
