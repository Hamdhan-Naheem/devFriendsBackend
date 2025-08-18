const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect(
    process.env.MONGO_SECRATE_KEY,
  );
};


module.exports = connectDB;
