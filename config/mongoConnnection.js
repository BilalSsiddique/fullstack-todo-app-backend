
const mongoose = require("mongoose");

async function connectToMongoDB(userName,password) {
  
  
  const connectionString = `mongodb+srv://${userName}:${password}@cluster0.ihqmkem.mongodb.net/?retryWrites=true&w=majority`

  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

module.exports = connectToMongoDB;



// const { MongoClient, ServerApiVersion } = require("mongodb");
// const uri =
//   "mongodb+srv://Bilal:<perfect7899>@cluster0.qllymfx.mongodb.net/?retryWrites=true&w=majority";
// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });
// async function connectToMongoDB() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!"
//     );
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// module.exports= connectToMongoDB