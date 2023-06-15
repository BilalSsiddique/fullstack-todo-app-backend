const User = require("../models/user");
const connectToMongoDB = require("../config/mongoConnnection");
const { validateTodos } = require("../helper");
require("dotenv").config();
const { ObjectId } = require("mongodb");

const usernamE = process.env.USER_NAME;
const password = process.env.PASSWORD;
const db = process.env.DB_NAME;

// start connection
connectToMongoDB(usernamE, password, db)
  .then((res) => res)
  .catch((res) => console.log(res));

const createTodo = async ({ userId, title, desc, checked, date }) => {
  // console.log(title, desc, checked, date);
  console.log("here in create tood funcntio");
  const validated = validateTodos({ title, desc, checked, date });
  console.log("validat todos", validated);
  if (!validated) return "no data received";
  const res = await getTodoById(userId);
  console.log("ewsss", res);
  const id = new ObjectId();
  const todos = [{ _id: id, title, desc, check: checked, date }];
  // const newUser = new User({
  //   name: name,
  //   todos: [
  //     {
  //       _id: id,
  //       title: title,
  //       desc: desc,
  //       check: checked,
  //       date: date,
  //     },
  //   ],
  // });

  try {
    await User.updateOne({ _id: userId }, { $push: { todos: todos } })
      .then(() => {
        console.log("Todos updated successfully.");
      })
      .catch((err) => {
        console.error("Error updating todos:", err);
      });
    // await newUser.save().then((res)=>console.log(res)).catch((res)=>console.log(res))
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
  console.log('id',id)
  if (id === undefined) {
    throw "Id is not provided";
  }
  if (typeof id === "string") {
    if (id.trim().length === 0) {
      throw new Error("id is not string or id is empty");
    }
  }
  try {
    const data = await User.find({ _id: id });
    console.log('data from dataabse',data)
    return data;
  } catch (error) {
    return "Todo id not found";
  }
};



const updateTodo = async (userId, todo) => {
  // console.log('checkssss',userId,todo)
  const { _id, title, desc, checked, date } = todo;
  console.log('request',title,desc,checked,date)
  if (typeof userId !== "string" || userId.trim().length === 0) {
    throw new Error("Invalid user ID");
  }

  try {
    const updatedUser = await User.findOne({ _id: userId });

    if (!updatedUser) {
      return "User not found";
    }

    const updatedTodo = updatedUser.todos.find(
      (item) => item._id.toString() === _id
    );

    if (!updatedTodo) {
      return "Todo not found";
    }
    // console.log('updated',updatedTodo)
    updatedTodo.title = title;
    updatedTodo.desc = desc;
    updatedTodo.check = checked;
    updatedTodo.date = date;

    updatedUser.markModified("todos"); // Mark the 'todos' array as modified
    console.log(updatedTodo,'updated')
    await updatedUser.save();

    return `${title} Updated Successfully`;
  } catch (error) {
    return error;
  }
};








const removeTodo = async (todoId, userId) => {
  // console.log('here','remove')
  if (typeof userId !== "string" || userId.trim().length === 0) {
    throw new Error("Invalid user ID");
  }

  if (typeof todoId !== "string" || todoId.trim().length === 0) {
    throw new Error("Invalid todo ID");
  }

  try {
    
    
    const user = await User.findOne({ _id: userId });
    // console.log('user',user)
    if (!user) {
      return "User not found";
    }
    const deletingTodo = user.todos.find(
      (todo) => todo._id.toString() === todoId
    );
    
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { todos: { _id: todoId } } },
      { new: true }
    );

    if (!updatedUser) {
      return "User not found";
    }

    

    if (!updatedUser) {
      return "Todo not found";
    }

  
    return `${deletingTodo.title} Deleted Successfully`;
  } catch (error) {
    return error;
  }
};
// const deleteTodo = async (id) => {
//   // console.log("id", id);
//   if (!id) {
//     throw "Id is not provide";
//   }
//   if (typeof id !== "string" || id.trim().length === 0) {
//     throw "id is not string or id is emty";
//   }
//   // if (ObjectId.isValid(id) !== true) {
//   //   throw "id not valid";
//   // }
//   // console.log("here", id);
//   const deletionInfo = await User.findOneAndRemove({
//     _id: id,
//   });

//   if (deletionInfo.deletedCount === 0) {
//     throw `could not delete movie with id of ${id}`;
//   }
//   console.log(deletionInfo);
//   return `${deletionInfo.title} Deleted Successfully`;
// };

module.exports = { createTodo, getTodos, getTodoById, updateTodo, removeTodo };
