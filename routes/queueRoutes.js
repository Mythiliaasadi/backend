const express = require("express");
const router = express.Router();
const Queue = require("../models/Queue");

// ================= BOOK OP =================
router.post("/book", async (req, res) => {
  try {

    const io = req.app.get("io");

    const last = await Queue.findOne().sort({ tokenNumber: -1 });
    const token = last ? last.tokenNumber + 1 : 1;

    const queue = new Queue({
      tokenNumber: token,
      ...req.body,
      status: "Waiting"
    });

    await queue.save();

    io.emit("queueUpdated");

    res.json(queue);

  } catch (err) {
    res.status(500).json(err);
  }
});


// ================= GET ALL =================
router.get("/all", async (req, res) => {
  const data = await Queue.find().sort({ tokenNumber: 1 });
  res.json(data);
});


// ================= CONFIRM =================
router.put("/confirm/:id", async (req, res) => {
  try {

    const io = req.app.get("io");

    const queue = await Queue.findByIdAndUpdate(
      req.params.id,
      { status: "Confirmed" },
      { new: true }
    );

    io.emit("queueUpdated");

    res.json(queue);

  } catch (err) {
    res.status(500).json(err);
  }
});


// ================= JOIN =================
router.put("/join/:id", async (req, res) => {
  try {

    const io = req.app.get("io");

    const queue = await Queue.findById(req.params.id);

    if (!queue) return res.status(404).json("Not Found");

    if (queue.status !== "Confirmed") {
      return res.status(400).json("Not Confirmed");
    }

    queue.status = "InQueue";
    queue.joinedAt = new Date();

    await queue.save();

    io.emit("queueUpdated");

    res.json(queue);

  } catch (err) {
    res.status(500).json(err);
  }
});


// ================= COMPLETE =================
router.delete("/complete/:id", async (req, res) => {
  try {

    const io = req.app.get("io");

    await Queue.findByIdAndDelete(req.params.id);

    io.emit("queueUpdated");

    res.json("Deleted");

  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;