const User = require("../models/user");
const connectToMongoDB = require("../config/mongoConnnection");
const validateTodos = require("../helper");
require("dotenv").config();

const serverUrl = process.env.DB_SERVER_URL;
const database = process.env.DB_NAME;


// start connection
connectToMongoDB({serverUrl,database}).then((res) => res);

const createTodo = async ({ title, desc, checked, date }) => {
  // console.log(title, desc, checked, date);

  const validated = validateTodos({ title, desc, checked, date });

  if (!validated) return "no data received";

  const newUser = new User({
    title: title,
    description: desc,
    check: checked,
    Date: date,
  });

  try {
    await newUser.save();
    return "Todo Created Successfully";
  } catch (error) {
    return "Error creating Todo:", error;
  }
};

const getTodos = async () => {
  try {
    const data = await User.find({});
    return data;
  } catch (error) {
    return "not found", error;
  }
};

const getTodoById = async (id) => {
  if (id === undefined) {
    throw "Id is not provided";
  }
  if (typeof id === "string") {
    if (id.trim().length === 0) {
      throw new Error("id is not string or id is empty");
    }
  }
  try {
    const data = User.find({ _id: id });
    return data;
  } catch (error) {
    return "Todo id not found";
  }
};

const updateTodo = async (id, todo) => {
  // console.log("check data", id, todo);
  if (id === undefined) {
    throw "Id is not provided";
  }
  if (typeof id === "string") {
    if (id.trim().length === 0) {
      throw new Error("id is not string or id is empty");
    }
  }
  await User.updateOne({ _id: id }, { $set: todo });

  const idObj = await getTodoById(id);

  return idObj;
};

const removeTodo = async (id) => {
  // console.log("id", id);
  if (!id) {
    throw "Id is not provide";
  }
  if (typeof id !== "string" || id.trim().length === 0) {
    throw "id is not string or id is emty";
  }
  // if (ObjectId.isValid(id) !== true) {
  //   throw "id not valid";
  // }
  // console.log("here", id);
  const deletionInfo = await User.findOneAndRemove({
    _id: id,
  });

  if (deletionInfo.deletedCount === 0) {
    throw `could not delete movie with id of ${id}`;
  }
  console.log(deletionInfo)
  return `${deletionInfo.title} Deleted Successfully`;
};

module.exports = { createTodo, getTodos, getTodoById, updateTodo, removeTodo };
