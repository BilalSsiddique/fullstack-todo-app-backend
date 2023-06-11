const express = require("express");
const cors= require('cors')
const app = express();
const todoRoutes = require("./routes/todo");

app.use(express.json());

app.use(
  cors({
    origin: "*",
    exposedHeaders: "Products-Total-Count",
  })
);
// register routes 
app.use('/todos',todoRoutes)
app.use("*", (req, res) => {
  res.status(404).json({ error: "Not found" });
});


app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
