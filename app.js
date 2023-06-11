const express = require("express");
const cors= require('cors')
const app = express();
const todoRoutes = require("./routes/todo");
const port = process.env.PORT || 3000;


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


app.listen(port, "0.0.0.0", () => {
  console.log("We've now got a server!");
  console.log(`Your routes will be running on http://localhost:${port}`);
});
