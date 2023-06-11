const express = require("express");
const router = express.Router();


const {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  removeTodo,
} = require("../data/index");
// GET /getData

router.post("/create-todo", async (req, res) => {
  try {
    const title = req.body.title;
    const desc = req.body.desc;
    const checked = req.body.checked;
    const date = req.body.date;

    const resp = await createTodo({
      title: title,
      desc: desc,
      checked: checked,
      date: date,
    });

    res.status(200).json(resp);
  } catch (e) {
    res.status(500).json({ error: "Todo not created" });
  }
});

router.get("/", async (req, res) => {
  const page= +req.query.currentPage || 1
  const itemsPerPage= +req.query.itemsPerPage || 5

  try {

    const resp = await getTodos();
    if (Array.isArray(resp) && resp.length >= 0) {
      
      const lastItemIndex = page * itemsPerPage
      const firstItemIndex= lastItemIndex - itemsPerPage
      const numberOfProducts = resp.slice(firstItemIndex,lastItemIndex)
      
      const totalProductsCount = resp.length;

      res.setHeader("Products-Total-Count", String(totalProductsCount)); // Set the header before sending the response
      res.status(200).json(numberOfProducts);
      return
    }
    // if (res?.length===0) res.status(404).json({ message: "No data found" });
    res.status(200).json([]);
  } catch (error) {
    res.status(500).json({ error: "Todo not found" });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id)
  if (!id) {
    res.status(400).json({ error: "no valid id is given" });
  }
  try {
    const todo = await getTodoById(id);

    res.status(200).json(todo);
  } catch (e) {
    res.status(404).json({ error: "Todo by id not found" });
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const todo = req.body;

  if (!id) {
    res.status(400).json({ error: "no valid id is given" });
    return;
  }
  if (
    todo.title === undefined ||
    todo.desc === undefined ||
    todo.checked === undefined ||
    todo.date === undefined
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
    const updatedtodo = await updateTodo(id, todo);

    res.status(200).json(updatedtodo);
  } catch (e) {
    res.status(400).json({ error: "check for error" });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

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
    const deletedtodo = await removeTodo(id);
    res.status(200).json(deletedtodo);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

module.exports = router;
