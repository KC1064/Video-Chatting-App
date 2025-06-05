const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = dbConnect;
