require("dotenv").config();

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." }
});
app.use("/api", apiLimiter);

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 500, default: "" },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" }
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Cloud Task Manager",
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch tasks." });
  }
});

app.post("/api/tasks", async (req, res) => {
  try {
    const { title, description, priority, status } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Task title is required." });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      status
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: "Could not create task." });
  }
});

app.patch("/api/tasks/:id", async (req, res) => {
  try {
    const allowed = ["title", "description", "priority", "status"];
    const update = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    }

    const task = await Task.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true
    });

    if (!task) return res.status(404).json({ error: "Task not found." });
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: "Could not update task." });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found." });
    res.json({ message: "Task deleted successfully." });
  } catch (error) {
    res.status(400).json({ error: "Could not delete task." });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

async function startServer() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is missing. Create a .env file before starting.");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected.");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Cloud Task Manager running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
}

startServer();