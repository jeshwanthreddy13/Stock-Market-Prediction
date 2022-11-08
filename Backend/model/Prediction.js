const mongoose = require("mongoose");

const predSchema = new mongoose.Schema({
  stocks: {
    type: Object,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Prediction", predSchema);