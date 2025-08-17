const express = require('express');
const router = express.Router();
const userAuth = require('../Middleware/authMiddleware');
const User = require('../Models/user');
const bcrypt = require('bcrypt');
const { validaterEditProfileData } = require('../utils/validation');
const validator = require('validator');

router.get('/profile/view', userAuth, async (req, res) => {
  const user = await req.user;
  res.send(user);
});


router.patch('/profile/edit', userAuth, async (req, res) => {
  try {
    if (!validaterEditProfileData(req)) {
      throw new Error('invalid body request');
    }
    const loggedUser = req.user;
    Object.keys(req.body).forEach(
      (field) => (loggedUser[field] = req.body[field]),
    );
    await loggedUser.save();
    res.json({
      message: `${loggedUser.firstName} is updated successfully`,
      data: { user: loggedUser },
    });
  } catch (err) {
    res.status(400).send('bad request ' + err.message);
  }
});

router.patch('/profile/editPassword', userAuth, async (req, res) => {
  //get oldpassword
  //check oldpassword is coorect
  //update new password
  try {
    const { oldPassword, newPassword } = req.body;
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error('password not strong');
    }
    const userPassword = req.user;
    const oldPasswordDb = userPassword.password;

    const deecodePassword = await bcrypt.compare(oldPassword, oldPasswordDb);

    if (!deecodePassword) {
      throw new Error('oldpassword is wrong');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    userPassword.password = passwordHash;

    res.cookie('token', null, {
      expires: new Date(Date.now()),
    });

    await userPassword.save();

    res.send('password upadated successfully');
  } catch (err) {
    res.status(400).send('bad request ' + err.message);
  }
});

module.exports = router;
