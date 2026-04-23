const router = require('express').Router();
const Volunteer = require('../Models/Volunteer');

// GET /api/volunteers  (optional ?sector=)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.sector) filter.sector = req.query.sector;
    const volunteers = await Volunteer.find(filter).sort({ createdAt: -1 });
    res.json(volunteers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/volunteers  — register
router.post('/', async (req, res) => {
  try {
    // derive sector from skills field if not provided
    const body = { ...req.body };
    if (!body.sector && body.skills) body.sector = body.skills;
    const volunteer = await Volunteer.create(body);
    res.status(201).json(volunteer);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'Phone already registered' });
    res.status(400).json({ error: err.message });
  }
});

// POST /api/volunteers/login  — login by phone
router.post('/login', async (req, res) => {
  try {
    const { phone } = req.body;
    const cleanPhone = phone.replace(/\+91/, "").trim();
    const volunteer = await Volunteer.findOne({ phone: cleanPhone });
    if (!volunteer) return res.status(404).json({ error: 'Volunteer not found' });
    res.json({ volunteer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/volunteers/:id/approve  — approve or reject
router.post('/:id/approve', async (req, res) => {
  try {
    const { approved, rejected } = req.body;
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { approved: !!approved, rejected: !!rejected },
      { new: true }
    );
    if (!volunteer) return res.status(404).json({ error: 'Volunteer not found' });
    res.json({ volunteer });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/volunteers/:id  — update availability etc.
router.patch('/:id', async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!volunteer) return res.status(404).json({ error: 'Volunteer not found' });
    res.json({ volunteer });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
