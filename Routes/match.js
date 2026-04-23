const router = require('express').Router();
const Task = require('../Models/Task');
const Volunteer = require('../Models/Volunteer');

// GET /api/match/:taskId  — find best matching volunteers for a task
router.get('/:taskId', async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    // Get approved + available volunteers in same sector
    const volunteers = await Volunteer.find({
      approved: true,
      available: true,
      $or: [
        { sector: task.sector },
        { skills: task.sector },
        { sector: { $exists: false } }
      ]
    });

    // Score each volunteer (same sector = higher score)
    const scored = volunteers.map(v => {
      let score = 0;
      if (v.sector === task.sector || v.skills === task.sector) score += 10;
      if (v.available) score += 5;
      return { volunteer: v, score };
    });

    scored.sort((a, b) => b.score - a.score);

    res.json(scored.slice(0, 5));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
