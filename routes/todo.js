const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { validateToken } = require("../helper");

const {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  removeTodo,
  getEditTodoById,
} = require("../data/index");

router.post("/create-todo", async (req, res) => {
  console.log("inside create-todo", req.body);
  try {
    const todos = req.body;
    console.log("reqiest", req.headers, todos, "sssssssssssssssssssss");
    const title = todos.title;
    const desc = todos.desc;
    const checked = todos.checked;
    const date = todos.date;
    const token = req.headers.authorization.split(" ")[1];
    console.log("hereee", title, desc, checked, date, token);
    console.log("token in back", token);
    const secretKey = process.env.SECRET_KEY;
    // console.log("request", name, title, desc, checked, date);
    const decoded = validateToken(token, secretKey);
    console.log("decode", decoded, decoded.userId);
    if (decoded?.userId) {
      const resp = await createTodo({
        userId: decoded.userId,
        title: title,
        desc: desc,
        checked: checked,
        date: date,
      });

      res.status(200).json(resp);
    }
  } catch (e) {
    res.status(500).json({ error: "Todo not created" });
  }
});

router.get("/", async (req, res) => {
  console.log('request called')
  console.log("query", req.query);
  const page = +req.query.currentPage || 1;
  const itemsPerPage = +req.query.itemsPerPage || 5;
  const authorizationHeader = req.headers && req.headers.authorization;
  if (!authorizationHeader) {
    return res.status(409).json('Token not found');
    // Handle the case where authorization header is missing
    // For example, return an error response or redirect to a login page
  }
  const token = authorizationHeader.split(" ")[1];
  
  const secretKey = process.env.SECRET_KEY;
 
  if (!token) {
    console.log("here inside token checnk");
    res.status(409).json("Token not found");
    return;
  }
  try {
    const decoded = validateToken(token, secretKey);
    
    if (decoded?.userId) {
      
      const resp = await getTodoById(decoded?.userId);
      
      if (
        Array.isArray(resp) &&
        resp.length >= 0 &&
        decoded &&
        Array.isArray(resp[0].todos)
      ) {
        const lastItemIndex = page * itemsPerPage;
        const firstItemIndex = lastItemIndex - itemsPerPage;
        // console.log("res for todos", resp[0].todos);
        const numberOfProducts = resp[0].todos.slice(
          firstItemIndex,
          lastItemIndex
        );

        const totalProductsCount = resp[0].todos.length;
        // console.log("number", numberOfProducts);
        res.setHeader("Products-Total-Count", String(totalProductsCount)); // Set the header before sending the response
        res.status(200).json(numberOfProducts);
        return;
      }
      // if (res?.length===0) res.status(404).json({ message: "No data found" });
      res.status(200).json([]);
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Token expired" });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const authorizationHeader = req.headers && req.headers.authorization;
  if (!authorizationHeader) {
    return res.status(409).json("Token not found");
    // Handle the case where authorization header is missing
    // For example, return an error response or redirect to a login page
  }
  const secretKey = process.env.SECRET_KEY;
  const token = authorizationHeader.split(" ")[1]
  console.log("idLLLL", id, token);
  if (!id) {
    res.status(400).json({ error: "no valid id is given" });
  }
  try {
    const decoded = validateToken(token, secretKey);
    console.log("decoded", decoded);
    if (decoded?.userId) {
      console.log("verify", decoded);
      const resp = await getTodoById(decoded?.userId);
      console.log("resss,", resp);
      if (Array.isArray(resp) && resp.length >= 0 && decoded.userId) {
        const [todos] = resp;
        console.log("todos", todos.todos);
        const filterTodo = todos.todos.filter(
          (todo, index) => todo._id.toString() === id
        );
        console.log("filter", filterTodo);
        res.status(200).json(filterTodo);
        return;
      } else {
        res.status(404).json("Todo not found");
        return;
      }
    } else {
      res.status(404).json({ error: "Token failed" });
      return;
    }
  } catch (e) {
    res.status(404).json({ error: "Todo by id not found" });
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const getTodo = req.body;
  const token = req.headers && req.headers.authorization.split(" ")[1];
  const secretKey = process.env.SECRET_KEY;
  console.log("check inside edit", id, getTodo, token);
  if (!id) {
    res.status(400).json({ error: "no valid id is given" });
    return;
  }
  if (
    getTodo.title === undefined ||
    getTodo.desc === undefined ||
    getTodo.checked === undefined ||
    getTodo.date === undefined
  ) {
    res.status(400).json({ error: "the request body is not valid" });
    return;
  }

  try {
    await getTodoById(id);
  } catch (e) {
    res.status(404).json({ error: "todo by id not found" });
    return;
  }

  try {
    const decoded = validateToken(token, secretKey);
    console.log("decoded", decoded);
    const { userId } = decoded;
    if (userId) {
      console.log("verify,updatij...", decoded);
      // console.log('resss,',resp)
      const updatedtodo = await updateTodo(userId, getTodo);
      res.status(200).json(updatedtodo);
    }
  } catch (e) {
    res.status(400).json({ error: "check for error" });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const token = req.headers && req.headers.authorization.split(" ")[1];
  const secretKey = process.env.SECRET_KEY;

  if (!id) {
    res.status(400).json({ error: "no valid id is given" });
    return;
  }
  try {
    await getTodoById(id);
  } catch (e) {
    res.status(404).json({ error: "todo by id not found" });
    return;
  }
  try {
    const decoded = validateToken(token, secretKey);
    console.log("decoded", decoded);
    const { userId } = decoded;
    if (userId) {
      console.log("verify,updatij...", decoded);
      // console.log('resss,',resp)
      const deletedtodo = await removeTodo(id, userId);
      res.status(200).json(deletedtodo);
    }
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

module.exports = router;
