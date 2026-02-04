const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cookieParser = require("cookie-parser");
const PORT = 4000;

const app = express();
app.use(express.json());
app.use(cookieParser());

const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const canteenRoutes = require("./routes/canteenRoutes.js");
const menuRoutes = require("./routes/menuRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/canteen", canteenRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/order", orderRoutes);

app.listen(PORT);
