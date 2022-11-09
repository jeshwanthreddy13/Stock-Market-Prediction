const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 1,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
  phone: {
    type: String,
    required: true,
    min:10,
    max:10
  },
  date: {
    type: Date,
    default: Date.now,
  },
  credits: {
    type: Number,
    default: 10000,
  },
});

module.exports = mongoose.model("User", userSchema);