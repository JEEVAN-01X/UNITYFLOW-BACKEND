const express = require("express");
const router = express.Router();
const Task = require("../Models/Task");
const Volunteer = require("../Models/Volunteer");

function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const adjacentSectors = {
  Healthcare: ["Women Safety"],
  "Flood Relief": ["Food and Hunger"],
  "Food and Hunger": ["Flood Relief"],
  Education: ["Women Safety"],
  "Women Safety": ["Healthcare", "Education"],
};

router.get("/:task_id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.task_id);
    if (!task) return res.status(404).json({ success: false, error: "Task not found" });

    const needed = task.volunteersNeeded || 1;
    const volunteers = await Volunteer.find({ available: true });

    const scored = volunteers.map((v) => {
      let skill_match = 0.0;
      if (v.skills.includes(task.sector)) {
        skill_match = 1.0;
      } else if (adjacentSectors[task.sector]?.some((s) => v.skills.includes(s))) {
        skill_match = 0.5;
      }

      const distKm = haversineDistance(
        task.location.lat, task.location.lng,
        v.location.lat, v.location.lng
      );
      const proximity_score = distKm <= 2 ? 1.0 : distKm >= 20 ? 0.0 : 1 - (distKm - 2) / 18;

      const availability = 1.0;

      const score = skill_match * 0.5 + proximity_score * 0.3 + availability * 0.2;

      const reason =
        skill_match === 1.0
          ? "Exact skill match for " + task.sector
          : skill_match === 0.5
          ? "Adjacent sector experience"
          : "Nearest available volunteer";

      return {
        volunteer: v,
        score: Math.round(score * 100),
        distanceKm: Math.round(distKm * 10) / 10,
        reason,
      };
    });

    const topMatches = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, needed);

    res.json({ success: true, volunteersNeeded: needed, matches: topMatches });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
