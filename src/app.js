const express = require('express');
const connectDb = require('./config/database');
const User = require('./Models/user');
const bcrypt = require('bcrypt');
const cookieParsor = require('cookie-parser');
const jwt = require('jsonwebtoken');
const userAuth = require('./Middleware/authMiddleware');

const authUser = require('./routes/auth');
const profile = require('./routes/profile');
const request = require('./routes/request');
const user = require('./routes/users');
const cors = require('cors')


const app = express();

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}
))

app.use(cookieParsor());
app.use(express.json());

app.use('/', authUser);
app.use('/', profile);
app.use('/', request);
app.use('/', user);

connectDb()
  .then(() => {
    console.log('Db conntected');
    app.listen(7777, () => {
      console.log('Application is connected on port 7777');
    });
  })
  .catch(() => {
    console.log('Db not connected');
  });
