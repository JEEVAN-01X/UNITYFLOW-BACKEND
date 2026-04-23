const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number },
  phone: { type: String, required: true, unique: true },
  skills: { type: String },
  sector: { type: String },
  location: {
    lat: { type: Number, default: 12.9716 },
    lng: { type: Number, default: 77.5946 }
  },
  available: { type: Boolean, default: true },
  approved: { type: Boolean, default: false },
  rejected: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Volunteer', volunteerSchema);
