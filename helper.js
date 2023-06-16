const jwt= require('jsonwebtoken')

const validateTodos = ({ title, desc, checked, date }) => {
  if ((title == undefined, desc === undefined, checked === undefined)) {
    return false;
  }
  if (
    title.trim().length === 0 &&
    desc.trim().length === 0 &&
    checked.trim().length === 0
  ) {
    return false;
  }

  return true;
};

const validation = (username, password) => {
  const errors = [];

  if (!username && !password) {
    errors.push("username and password must be supplied");
  }
  if ((typeof username !== "string") & (typeof password !== "string")) {
    errors.push("username and password must be type of string");
  }
  if (!username.trim().length) {
    errors.push("username is empty!");
  }
  if (!password.trim().length) {
    errors.push("password is empty!");
  }
  if (/\s/g.test(username)) {
    errors.push("username must not have any whitespaces");
  }
  if (!password.trim().length) {
    errors.push("username is empty!");
  }
  if (/\s/g.test(password)) {
    errors.push("password must not have any whitespaces");
  }
  if (!/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/.test(username)) {
    if (username.length < 4) {
      errors.push(
        "username must have alphanumeric characters and should be 4 characters long"
      );
    }
    errors.push("username must have alphanumeric characters");
  }
  if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(
      password
    )
  ) {
    errors.push("Password must contain lowerCase upperCase numbers & special char ");
  }

  return errors.length === 0 ? null : errors;
};


function validateToken(token,secretKey) {
  try {
    // Verify the token and decode its payload
  
    const decoded = jwt.verify(token, secretKey);


    // Check if the token has expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      throw new Error("Token has expired");
    }

    // Return the decoded token
    return decoded;
  } catch (error) {
    // Token validation failed
    throw new Error(' token failed');
  }
}

module.exports = { validation, validateTodos,validateToken };
