const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // If you need to send cookies
  })
);

const Middlewares = require("./middlewares/index.js");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(require("cookie-parser")());
//serve uploads as static file(for company logo)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Set up the environment variables
require("dotenv").config();

// Database configuration and connection
const { sequelize } = require("./models/");
const { connectRedis } = require("./config/redis.js");

// Set environmnt to development
process.env.NODE_ENV = "development";

// Database connection
sequelize
  .authenticate() // Change to false after first run
  .then(() => {
    console.log("Connection has been established successfully.");

    // Start the server
    app.listen(process.env.PORT, async () => {
      // await connectRedis(process.env.REDIS_URL);
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

// Only for testing. TODO: Secure this route
app.get("/sync", async (req, res) => {
  const sequelize = require("./config/database.js");
  await sequelize.sync({ alter: true });
  res.send("Successfully Synced");
});

// Base router
app.use("/", Middlewares.userExists, require("./routes/index.js"));
app.use(Middlewares.error);
