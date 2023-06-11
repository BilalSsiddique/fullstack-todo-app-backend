
const mongoose = require("mongoose");

async function connectToMongoDB(settings) {
  const { serverUrl, database } = settings;
  
  const connectionString = `${serverUrl}/${database}`;

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
