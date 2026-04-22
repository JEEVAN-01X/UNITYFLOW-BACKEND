const express = require("express");
const router = express.Router();
const Task = require("../Models/Task");
const Volunteer = require("../Models/Volunteer");

// POST /api/tasks — citizen submits a report
router.post("/", async (req, res) => {
  try {
    const { sector, description, urgency, location, reporterName } = req.body;
    const task = await Task.create({ sector, description, urgency, location, reporterName });
    res.status(201).json({ success: true, task });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET /api/tasks — NGO dashboard fetches all tasks
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.sector) filter.sector = req.query.sector;
    if (req.query.status) filter.status = req.query.status;
    const tasks = await Task.find(filter).populate("assignedVolunteer").sort({ urgency: -1, createdAt: -1 });
    res.json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/tasks/:id/assign — NGO assigns a volunteer
router.post("/:id/assign", async (req, res) => {
  try {
    const { volunteerId } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { assignedVolunteer: volunteerId, status: "assigned" },
      { new: true }
    ).populate("assignedVolunteer");
    if (!task) return res.status(404).json({ success: false, error: "Task not found" });
    res.json({ success: true, task });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/tasks/:id/complete — volunteer marks task done
router.post("/:id/complete", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: "completed" },
      { new: true }
    );
    if (!task) return res.status(404).json({ success: false, error: "Task not found" });
    res.json({ success: true, task });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
