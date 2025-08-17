const express = require('express');
const router = express.Router();
const User = require('../Models/user');
const bcrypt = require('bcrypt');
const { validateSignUpData } = require('../utils/validation');
router.post('/signUp', async (req, res) => {
  validateSignUpData(req);
  const { firstName, lastName, email, password } = req.body;

  const hashPassword = await bcrypt.hash(password, 10);

  const user = new User({
    firstName,
    lastName,
    email,
    password: hashPassword,
  });

  try {
    const savedUer = await user.save();
    const token = await savedUer.getJWT()
    res.cookie("token", token)
    res.json({message:"user created successfully", data:savedUer})
  } catch (err) {
    res.status(400).send('bad request ' + err.message);
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error('invalid credential');
    }

    const validatePassword = await user.validatePassword(password);
    if (validatePassword) {
      const token = await user.getJWT();
      res.cookie('token', token);
      res.send(user);
    } else {
      throw new Error('invalid credential');
    }
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

router.post('/logout', async (req, res) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
  });

  res.send('Logout successfully!');
});

module.exports = router;
