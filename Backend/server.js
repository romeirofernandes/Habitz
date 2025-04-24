const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();
const PORT = process.env.PORT || 8000;

const app = express();
connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
