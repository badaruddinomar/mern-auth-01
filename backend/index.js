const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoute");
const authRoutes = require("./routes/authRoute");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const errorMiddleware = require("./utils/error");
const { frontendUrl } = require("./helper");
const cors = require("cors");
const path = require("path");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// handling uncaught exceptions--
process.on("uncaughtException", (err) => {
  console.log(`error: ${err.message}`);
  console.log(`Uncaught exception: ${err.stack}`);
  process.exit(1);
});

// Database connection--
mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((data) => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log(err.message);
  });
// routes starts--
app.use("/api/v1", userRoutes);
app.use("/api/v1", authRoutes);
// static file handling--
const __variableOfChoice = path.resolve();
app.use(express.static(path.join(__variableOfChoice, "/frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__variableOfChoice, "frontend", "dist", "index.html"));
});

// Error Handler--
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong!";

  return res.status(statusCode).json({
    success: false,
    message,
  });
});
// middleware for errors--
app.use(errorMiddleware);
// Server created--
const server = app.listen(process.env.PORT || 4000, () => {
  console.log(`server listening on port http://localhost:${process.env.PORT}`);
});
// Unhandled promise rejection---
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shuting down the server due to unhandled promise rejection!`);

  server.close(() => {
    process.exit(1);
  });
});
