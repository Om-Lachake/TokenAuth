const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(process.env.MONGO_URL);
};

module.exports = connectDb;
