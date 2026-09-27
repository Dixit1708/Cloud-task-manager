require("dotenv").config();
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    priority: String,
    status: String
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

const sampleTasks = [
  {
    title: "Configure AWS EC2",
    description: "Create an Ubuntu EC2 instance and configure the security group.",
    priority: "High",
    status: "Completed"
  },
  {
    title: "Connect MongoDB Atlas",
    description: "Add the cloud database connection string to the environment.",
    priority: "High",
    status: "In Progress"
  },
  {
    title: "Enable HTTPS",
    description: "Configure Nginx reverse proxy and an SSL certificate.",
    priority: "Medium",
    status: "Pending"
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Task.deleteMany({});
  await Task.insertMany(sampleTasks);
  console.log("Sample tasks inserted.");
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});