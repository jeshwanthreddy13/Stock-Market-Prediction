const mongoose = require("mongoose");

const recSchema = new mongoose.Schema({
  stocks: {
    type: Object,
    required: true,
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  }
});

module.exports = mongoose.model("Recommendation", recSchema);