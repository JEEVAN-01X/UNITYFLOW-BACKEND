const router = require('express').Router();
const Task = require('../Models/Task');

// GET /api/tasks  (optional ?sector=)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.sector) filter.sector = req.query.sector;
    const tasks = await Task.find(filter).populate('assignedTo').sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/tasks  — create a task
router.post('/', async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/tasks/:id
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo');
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/tasks/:id/assign
router.post('/:id/assign', async (req, res) => {
  try {
    const { volunteerId } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: 'assigned', assignedTo: volunteerId },
      { new: true }
    ).populate('assignedTo');
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/tasks/:id/complete
router.post('/:id/complete', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: 'completed' },
      { new: true }
    );
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
