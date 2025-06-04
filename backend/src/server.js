require("dotenv").config();
const express = require("express");

const app = express();

app.get("/api/hello", (req, res) => {
  res.send("Hello World");
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
