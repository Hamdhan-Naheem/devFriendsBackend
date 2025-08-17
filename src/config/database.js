const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect(
    'mongodb+srv://HamdhanCo:U1O0ibBcMq2f3Eu3@hamdhanco.ohwdhkw.mongodb.net/Tinder',
  );
};

module.exports = connectDB;
