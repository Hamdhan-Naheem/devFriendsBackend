const validator = require('validator');

const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error('Missing Name');
  } else if (!validator.isEmail(email)) {
    throw new Error('Email not valid');
  } else if (!validator.isStrongPassword(password)) {
    throw new Error('password is not valid');
  }
};

const validaterEditProfileData = (req) => {
  const allowedEditFields = [
    'firstName',
    'lastName',
    'skills',
    'phoneNumber',
    'gender',
    'profile',
    'photoUrl',
    'age',
  ];

  const bodyKeys = Object.keys(req.body);

  const isValid = bodyKeys.every((field) => {
    const allowed = allowedEditFields.includes(field);
    if (!allowed) {
      console.log('Disallowed field found:', field);
    }
    return allowed;
  });

  return isValid;
};

module.exports = {
  validateSignUpData,
  validaterEditProfileData,
};
