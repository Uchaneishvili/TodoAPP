const express = require("express");
const mongoose = require("mongoose");
const app = express();
const todoTasks = require("./models/todoTasks");

var cors = require("cors");

app.use(express.json());
app.use(cors());

mongoose.connect(
  "mongodb+srv://guchaneishvili:Gig@20003030@cluster0.p6fos.mongodb.net/todoApp?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
  }
);

app.get("/read", async (req, res) => {
  todoTasks.find({}, (err, result) => {
    if (err) {
      console.log(err);
    }

    res.send(result);
  });
});

app.post("/insert", async (req, res) => {
  const { name } = req.body;

  const task = new todoTasks({
    name: name,
  });
  try {
    await task.save();
    res.send("INSERTED DATA ‼️");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  await todoTasks.findByIdAndRemove(id).exec();

  res.send("deleted !♻️");
});

app.listen(3001, () => {
  console.log("🚀 Server running on port 3001... ");
});
