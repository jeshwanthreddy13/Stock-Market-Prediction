const express = require("express");
const app = express();
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const stockRoutes = require("./routes/stocks");
const profileRoutes = require('./routes/profile');
const predRoutes = require('./routes/pred');
const verifyToken = require("./routes/validate-token");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

dotenv.config();
app.use(express.json());

dotenv.config();

mongoose.connect(
process.env.DB_CONNECT,
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
},
() => console.log("connected to db")
);

app.use("/api", authRoutes);
app.use("/api/dashboard", verifyToken, dashboardRoutes);
app.use("/api/stocks",  verifyToken, stockRoutes);
app.use("/api/profile",  verifyToken, profileRoutes);
app.use("/api/predictions", predRoutes);

app.listen(3001, () => console.log("server is running..."));