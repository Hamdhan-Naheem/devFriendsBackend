const User = require('../Models/user');
const jwt = require('jsonwebtoken');

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  try {
    if (!token) {
      return res.status(401).send("please login!");
    }

    const deecodeUser = jwt.verify(token, process.env.JWT_SECRATE);

    const user = await User.findById(deecodeUser);

    if (!user) {
      throw new Error('user not found');
    }

    req.user = user;

    next();
  } catch (err) {
    res.status(400).send('bad request ' + err.message);
  }
};

module.exports = userAuth;
