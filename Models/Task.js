const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  sector: { type: String, required: true },
  urgency: { type: Number, min: 1, max: 5, required: true },
  description: { type: String, required: true },
  reporterName: { type: String, default: 'Anonymous' },
  location: {
    lat: { type: Number, default: 12.9716 },
    lng: { type: Number, default: 77.5946 }
  },
  status: { type: String, enum: ['open', 'assigned', 'completed'], default: 'open' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
