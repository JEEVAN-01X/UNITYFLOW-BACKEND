const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  skills: [{ type: String }],
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  available: { type: Boolean, default: true },
  phone: { type: String, default: "" },
});

module.exports = mongoose.model("Volunteer", volunteerSchema);
