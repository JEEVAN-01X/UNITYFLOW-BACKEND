const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    sector: {
      type: String,
      enum: ["Healthcare", "Flood Relief", "Food and Hunger", "Education", "Women Safety"],
      required: true,
    },
    description: { type: String, required: true },
    urgency: { type: Number, min: 1, max: 5, required: true },
    volunteersNeeded: { type: Number, default: 1 },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    reporterName: { type: String, default: "Anonymous" },
    status: {
      type: String,
      enum: ["open", "assigned", "completed"],
      default: "open",
    },
    assignedVolunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Volunteer",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
