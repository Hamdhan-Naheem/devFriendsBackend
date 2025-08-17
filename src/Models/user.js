const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      require: true,
      minLength: 4,
      maxLength: 30,
    },
    lastName: {
      type: String,
      require: true,
      minLength: 4,
      maxLength: 30,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      trim: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error('invalid email');
        }
      },
    },
    password: {
      type: String,
      require: true,
      validate: (value) => {
        if (!validator.isStrongPassword(value)) {
          throw new Error('invalid password');
        }
      },
    },

    phoneNumber: {
      type: String,
      require: true,
      max: 10,
    },
    age: {
      type: Number,
      require: true,
      min: 18,
    },
    gender: {
      type: String,
      require: true,
      enum: {
        values: ['male', 'female', 'other'],
        message: `{VALUE} is not a valid gender type`,
      },
    },
    photoUrl: {
      type: String,
      validate: (value) => {
        if (!validator.isURL(value)) {
          throw new Error('not valied url: ' + value);
        }
      },
      default:"https://images.app.goo.gl/XR4Z2AVQtDyqAjNs8"
    },
    skills: {
      type: [String],
    },
    profile: {
      type: String,
      maxLength: 100,
      minLength: 10,
    },
  },
  { timestamps: true },
);

userSchema.methods.validatePassword = async function (inputUserPassword) {
  const user = this;
  const hashPassword = user.password;

  const validatePassword = await bcrypt.compare(
    inputUserPassword,
    hashPassword,
  );

  return validatePassword;
};

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, 'ham123');

  return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
