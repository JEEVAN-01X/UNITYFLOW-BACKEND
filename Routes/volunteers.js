const express = require("express");
const router = express.Router();
const Volunteer = require("../Models/Volunteer");

router.get("/", async (req, res) => {
  try {
    const volunteers = await Volunteer.find({});
    res.json(volunteers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
