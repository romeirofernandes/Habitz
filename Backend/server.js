const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const habitRoutes = require("./routes/habitRoutes");
const partnerRoutes = require("./routes/partnerRoutes");
const authRoutes = require('./routes/authroutes');
require("dotenv").config();
const PORT = process.env.PORT || 8000;

const app = express();
connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/habits", habitRoutes);

// Mount routers
app.use('/api/auth', authRoutes);

app.use('/api/partners', partnerRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Habitz API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});