require("dotenv").config();
const borrowerRoutes = require("./routes/borrowerRoutes");
const borrowRoutes=require("./routes/borrowRoutes");
const issueRoutes = require("./routes/issueRoutes");

// Initialize Cron Jobs
require("./cron/dueDateCron");

const express = require("express");
const connectDB = require("./config/db");
const bookRoutes = require("./routes/bookRoutes");
const cors = require("cors");


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Library Management API is running 🚀");
});

app.use("/api/books", bookRoutes);
app.use("/api/borrowers", borrowerRoutes);
app.use("/api/borrows", borrowRoutes);
app.use("/api/issue", issueRoutes);

// Test Route to manually trigger due date emails
app.get("/api/test-cron", async (req, res) => {
  const { runNotificationJob } = require("./cron/dueDateCron");
  await runNotificationJob();
  res.send("Notification job triggered manually. Check console logs.");
});

const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
