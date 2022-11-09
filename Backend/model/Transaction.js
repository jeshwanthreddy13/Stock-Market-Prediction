const mongoose = require("mongoose");

const tranSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    transactions: {
        type: Array,
        required: true
    }
});

module.exports = mongoose.model("Transaction", tranSchema);