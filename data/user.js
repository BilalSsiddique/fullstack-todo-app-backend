const { validation } = require("../helper");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const createUser = async (username, password, todos) => {
  console.log("here");
  const pass = password;
  try {
    const existingUser = await User.findOne({ name: username });
    console.log(";exxxxxxx", existingUser);
    if (existingUser) {
      return false;
    }
    const salt = bcrypt.genSalt(10);
    const password = await bcrypt.hash(pass, parseInt(salt));
    const insertInfo = await User.create({
      name: username,
      password,
      todos: todos,
    });
    console.log('insert"', insertInfo);
    if (insertInfo.insertedCount === 0) return { insertedUser: false };

    return { insertedUser: true, insertInfo };
  } catch (error) {
    return error;
  }
};

// createUser('Bilal4845','Hor85*m').then((res)=> console.log(res))
const checkUser = async (username, password) => {
  console.log("here inside check user", username);
  try {
    const user = await User.findOne({ name: username });
    console.log(user, "user");
    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);
      if (validPassword) return { authenticatedUser: true, user };
      else {
        return {
          authenticatedUser: false,
          message: "Either the username or password is invalid",
        };
      }
    } else {
      return {
        authenticatedUser: false,
        message: "Either the username or password is invalid",
      };
    }
  } catch (error) {
    throw error;
  }
};
// checkUser("BILAL555", "Perfect777*").then((res) => console.log(res));

module.exports = { checkUser, createUser };
