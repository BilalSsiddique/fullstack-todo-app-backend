const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  title: String,
  description: String,
  check: Boolean,
  Date: {
    type: Date,
    default: () => {
      let currentDate = new Date().toJSON().slice(0, 10);
      return currentDate
    },
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
