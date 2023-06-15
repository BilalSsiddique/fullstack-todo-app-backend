const express = require("express");
const router = express.Router();
const { validation } = require("../helper");
const userData = require("../data/user");
const jwt = require("jsonwebtoken");
const { getTodoById } = require("../data");
// authorization

router.post("/register", async (req, res) => {
  const secretKey = process.env.SECRET_KEY;
  const username = req.body.name;
  const password = req.body.password;
  const { todos } = req.body;
  try {
    const errors = validation(username, password);

    console.log("validatir cjeck", errors);
    if (Array.isArray(errors) && errors.length > 0) {
      throw { validationErrors: errors };
    }
    console.log("here 1");
    const user = await userData.createUser(username, password, todos);
    console.log("user esonse:", user);
    console.log("route called");
    if (user === false) {
      console.log("inside user check");
      res.status(409).json({ error: "username already exists" });
      return;
    }
    if (user.insertedUser) {
      const insertInfo = user.insertInfo;
      console.log("herezzzzzzzzzzzzzz", insertInfo);
      const token = jwt.sign({ userId: insertInfo._id }, secretKey, {
        expiresIn: "1h", // Set the token expiration time
      });
      res.status(200).json({ token });
      return;
    } else if (user.insertedUser === false) {
      console.log("check here");
      res.status(409).json({ error: user });
      return;
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (error) {
    // console.log('sss',error.validationErrors);
    if (error.validationErrors) {
      res.status(400).json({ errors: error.validationErrors });
    }
  }
});

router.post("/login", async (req, res) => {
  // const token = req.headers.authorization.split(" ")[1];
  const secretKey = process.env.SECRET_KEY;
  const username = req.body.name;
  const password = req.body.password;
  try {
    const errors = validation(username, password);

    console.log("validatir cjeck", errors);
    if (Array.isArray(errors) && errors.length > 0) {
      throw { validationErrors: errors };
    }
    console.log("here 1");
    const user = await userData.checkUser(username, password);
    if (user.authenticatedUser){
      console.log("herezzzzzzzzzzzzzz", user.user);
      const token = jwt.sign({ userId: user.user._id }, secretKey, {
        expiresIn: "1h", // Set the token expiration time
      })
      res.status(200).json({ token });
      return;
    }
    if (user.authenticatedUser===false){
      res.status(409).json({error:user.message})
    }
    
  } catch (error) {
    // console.log('sss',error.validationErrors);
    if (error.validationErrors) {
      res.status(400).json({ errors: error.validationErrors });
    }
  }
});

module.exports = router;
