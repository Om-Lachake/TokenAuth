const validator = require("validator");

const validateEmail = (email) => {
  return validator.isEmail(email);
};

const validateData = (req) => {
  const { firstName, lastName, emailId } = req.body;

  if (firstName.length <= 1 || firstName.length >= 20) {
    throw new Error("First Name should be of length 2-19 characters long only");
  } else if (lastName.length <= 1 || lastName.length >= 20) {
    throw new Error("Last Name should be of length 2-19 characters long only");
  } else if (!validateEmail(emailId)) {
    throw new Error("Invalid email address");
  }
};

module.exports = {
  validateEmail,
  validateData,
};
