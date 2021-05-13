const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const todoTasks = mongoose.model("tasks", taskSchema);
module.exports = todoTasks;
