const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sector: { type: String, required: true },
  darpanId: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
});

module.exports = mongoose.model("NGO", ngoSchema);
