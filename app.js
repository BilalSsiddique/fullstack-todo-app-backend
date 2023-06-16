const express = require("express");
const cors= require('cors')
const app = express();
const todoRoutes = require("./routes/todo");
const userRoutes = require('./routes/user')
const port = process.env.PORT || 3000;
const build = require('./dist')

app.use(express.json());

const allowedOrigins = [
  "http://localhost:3000",
  "http://192.168.157.80:3000",
  "http://127.0.0.1:5173",
  "https://fullstack-todo-app-frontend.vercel.app", // Replace with your Vercel deployment URL
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    exposedHeaders: "Products-Total-Count",
  })
);

// app.use(
//   cors({
//     origin: "*",
//     exposedHeaders: "Products-Total-Count",
//   })
// );

// register routes 
app.use('/todos',todoRoutes)
app.use("/", userRoutes);
app.use("*", (req, res) => {
  res.status(404).json({ error: "route Not found" });
});

app.use(express.static(path.join(__dirname, `${build}`)));

app.get("/*", function (req, res) {
  res.sendFile(
    path.join(__dirname, `${build}`, "index.html")
  );
});

app.get("/todos", (req, res) => {
  const token =
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(409).json("Token not found");
  }
});

console.log('port',port)
app.listen(port, "0.0.0.0", () => {
  console.log("We've now got a server!");
  console.log(`Your routes will be running on http://localhost:${port}`);
});
