require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const dbConnect = require("./lib/db");
const userRoutes = require("./routes/user.routes");
dbConnect();
//Learning: Missed this so got a type error when checking in POSTMAN
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // allows frontend to send cookies
  })
);
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
