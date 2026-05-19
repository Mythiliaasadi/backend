const mongoose = require("mongoose");

const queueSchema = new mongoose.Schema({
  tokenNumber: Number,
  patientName: String,
  doctor: String,
  department: String,
  date: String,
  status: { type: String, default: "Waiting" },
  joinedAt: Date
});

module.exports = mongoose.model("Queue", queueSchema);