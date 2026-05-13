const express = require("express");
const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// In-memory storage
let todos = [
  { id: 1, title: "Learn Node.js", completed: false },
  { id: 2, title: "Build a REST API", completed: true },
  { id: 3, title: "Write documentation", completed: false },
  { id: 4, title: "Deploy the app", completed: false },
  { id: 5, title: "Celebrate!", completed: false },
];
let nextId = 1;

// GET /todos – get all todos
app.get("/todos", (req, res) => {
  res.json(todos);
});

// GET /todos/:id – get a single todo
app.get("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const todo = todos.find((t) => t.id === id);
  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }
  res.json(todo);
});

// POST /todos – create a new todo
app.post("/todos", (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== "string") {
    return res
      .status(400)
      .json({ error: "Title is required and must be a string" });
  }

  const newTodo = {
    id: nextId++,
    title: title.trim(),
    completed: false,
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT /todos/:id – update a todo
app.put("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const todoIndex = todos.findIndex((t) => t.id === id);
  if (todoIndex === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }

  const { title, completed } = req.body;
  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      return res
        .status(400)
        .json({ error: "Title must be a non-empty string" });
    }
    todos[todoIndex].title = title.trim();
  }
  if (completed !== undefined) {
    if (typeof completed !== "boolean") {
      return res.status(400).json({ error: "Completed must be a boolean" });
    }
    todos[todoIndex].completed = completed;
  }

  res.json(todos[todoIndex]);
});

// DELETE /todos/:id – delete a todo
app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const todoIndex = todos.findIndex((t) => t.id === id);
  if (todoIndex === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }

  todos.splice(todoIndex, 1);
  res.json({ message: "Todo deleted successfully" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
