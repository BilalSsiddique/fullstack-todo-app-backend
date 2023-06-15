const express = require("express");
const cors= require('cors')
const app = express();
const todoRoutes = require("./routes/todo");
const userRoutes = require('./routes/user')
const port = process.env.PORT || 3000;


app.use(express.json());

const allowedOrigins = [
  "http://localhost:3000",
  "http://192.168.157.80:3000",
  "http://127.0.0.1:5173",
  "https://fullstack-todo-app-frontend.vercel.app/", // Replace with your Vercel deployment URL
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



// function authenticateToken(req, res, next) {
//   const authHeader = req.headers.authorization;
//   const token = authHeader && authHeader.split(" ")[1];

//   // Exclude token check for login and registration routes
//   if (req.path === "/login" || req.path === "/register") {
//     return next();
//   }

//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   jwt.verify(token, secretKey, (err, user) => {
//     if (err) {
//       if (err.name === "TokenExpiredError") {
//         return res.status(401).json({ message: "Token expired" });
//       } else {
//         return res.status(403).json({ message: "Forbidden" });
//       }
//     }

//     // Token is valid, attach user information to the request
//     req.user = user;

//     next();
//   });
// }

// Apply the middleware globally to all routes
// app.use(authenticateToken);


// register routes 
app.use('/todos',todoRoutes)
app.use("/", userRoutes);
app.use("*", (req, res) => {
  res.status(404).json({ error: "route Not found" });
});

console.log('port',port)
app.listen(port, "0.0.0.0", () => {
  console.log("We've now got a server!");
  console.log(`Your routes will be running on http://localhost:${port}`);
});
