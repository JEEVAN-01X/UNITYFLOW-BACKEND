require('dotenv').config();
const mongoose = require('mongoose');
const Volunteer = require('./Models/Volunteer');
const Task = require('./Models/Task');

const volunteers = [
  { name: 'Arjun Sharma', age: 28, phone: '9876543210', skills: 'Flood Relief', sector: 'Flood Relief', available: true, approved: true },
  { name: 'Priya Nair', age: 25, phone: '9876543211', skills: 'Healthcare', sector: 'Healthcare', available: true, approved: true },
  { name: 'Nikhil Shetty', age: 30, phone: '9876543212', skills: 'Flood Relief', sector: 'Flood Relief', available: true, approved: true },
  { name: 'Sneha Rao', age: 27, phone: '9876543213', skills: 'Education', sector: 'Education', available: true, approved: true },
  { name: 'Vikram Das', age: 35, phone: '9876543214', skills: 'Food and Hunger', sector: 'Food and Hunger', available: false, approved: true },
];

const tasks = [
  { sector: 'Flood Relief', urgency: 5, description: 'Area flooded, 30 families displaced, need immediate help.', reporterName: 'Ramesh', status: 'assigned' },
  { sector: 'Flood Relief', urgency: 5, description: 'Basement waterlogged, residents trapped on upper floor.', reporterName: 'Kavitha', status: 'completed' },
  { sector: 'Flood Relief', urgency: 4, description: 'accident happened', reporterName: 'Anonymous', status: 'open' },
  { sector: 'Healthcare', urgency: 3, description: 'Elderly person needs medicine delivery.', reporterName: 'Sunita', status: 'open' },
  { sector: 'Food and Hunger', urgency: 4, description: '50 people stranded without food for 2 days.', reporterName: 'Mohan', status: 'open' },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await Volunteer.deleteMany({});
  await Task.deleteMany({});

  await Volunteer.insertMany(volunteers);
  await Task.insertMany(tasks);

  console.log('✅ Seeded volunteers and tasks!');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
