require("dotenv").config();
const express = require("express");
const app = express();
const dbConnect = require("./lib/db");

dbConnect();
//Learning: Missed this so got a type error when checking in POSTMAN
app.use(express.json());
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
