const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  stock_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  credits_invested: {
    type: Number,
    required: true,
  },
  stock_units: {
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model("Stocks", stockSchema);