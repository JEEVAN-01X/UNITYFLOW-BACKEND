require("dotenv").config();
const mongoose = require("mongoose");
const Volunteer = require("./Models/Volunteer");
const Task = require("./Models/Task");
const NGO = require("./Models/NGO");

const volunteers = [
  { name: "Arjun Sharma",   skills: ["Flood Relief", "Food and Hunger"], location: { lat: 12.9716, lng: 77.5946 }, available: true },
  { name: "Priya Nair",     skills: ["Healthcare", "Women Safety"],      location: { lat: 12.9352, lng: 77.6245 }, available: true },
  { name: "Kiran Reddy",    skills: ["Flood Relief"],                    location: { lat: 12.9539, lng: 77.5739 }, available: true },
  { name: "Meera Iyer",     skills: ["Education", "Women Safety"],       location: { lat: 12.9719, lng: 77.6412 }, available: true },
  { name: "Rohan Das",      skills: ["Food and Hunger"],                 location: { lat: 12.9850, lng: 77.5533 }, available: true },
  { name: "Sneha Pillai",   skills: ["Healthcare"],                      location: { lat: 12.9611, lng: 77.6387 }, available: true },
  { name: "Vikram Singh",   skills: ["Flood Relief", "Healthcare"],      location: { lat: 12.9450, lng: 77.5600 }, available: true },
  { name: "Ananya Rao",     skills: ["Women Safety", "Education"],       location: { lat: 13.0012, lng: 77.5880 }, available: true },
  { name: "Suresh Kumar",   skills: ["Food and Hunger", "Flood Relief"], location: { lat: 12.9290, lng: 77.5780 }, available: true },
  { name: "Lakshmi Venkat", skills: ["Education"],                       location: { lat: 12.9900, lng: 77.6100 }, available: true },
  { name: "Aditya Menon",   skills: ["Healthcare", "Food and Hunger"],   location: { lat: 12.9765, lng: 77.5692 }, available: true },
  { name: "Divya Krishnan", skills: ["Women Safety"],                    location: { lat: 12.9481, lng: 77.5731 }, available: false },
  { name: "Rahul Bose",     skills: ["Flood Relief"],                    location: { lat: 12.9623, lng: 77.6023 }, available: true },
  { name: "Pooja Hegde",    skills: ["Education", "Healthcare"],         location: { lat: 13.0105, lng: 77.5555 }, available: true },
  { name: "Nikhil Patel",   skills: ["Food and Hunger"],                 location: { lat: 12.9380, lng: 77.6290 }, available: true },
  { name: "Shruti Joshi",   skills: ["Women Safety", "Healthcare"],      location: { lat: 12.9834, lng: 77.5903 }, available: true },
  { name: "Tarun Mehta",    skills: ["Flood Relief", "Education"],       location: { lat: 12.9512, lng: 77.5846 }, available: true },
  { name: "Kavya Nair",     skills: ["Healthcare"],                      location: { lat: 12.9677, lng: 77.6201 }, available: false },
  { name: "Siddharth Roy",  skills: ["Food and Hunger", "Women Safety"], location: { lat: 13.0023, lng: 77.6043 }, available: true },
  { name: "Bhavana Reddy",  skills: ["Education"],                       location: { lat: 12.9744, lng: 77.5798 }, available: true },
];

const tasks = [
  { sector: "Flood Relief",    description: "Area flooded, 30 families displaced, need immediate help.", urgency: 5, volunteersNeeded: 5, location: { lat: 12.9716, lng: 77.5946 }, reporterName: "Ramesh" },
  { sector: "Healthcare",      description: "Elderly woman unconscious, no ambulance available.",        urgency: 5, volunteersNeeded: 2, location: { lat: 12.9352, lng: 77.6245 }, reporterName: "Sunita" },
  { sector: "Food and Hunger", description: "Shelter camp running out of food, 50+ people.",             urgency: 4, volunteersNeeded: 4, location: { lat: 12.9539, lng: 77.5739 }, reporterName: "Mohan"  },
  { sector: "Women Safety",    description: "Woman being harassed near KR Market, needs escort.",        urgency: 4, volunteersNeeded: 2, location: { lat: 12.9719, lng: 77.6412 }, reporterName: "Asha"   },
  { sector: "Education",       description: "Flood displaced kids need temporary learning space.",        urgency: 3, volunteersNeeded: 3, location: { lat: 12.9850, lng: 77.5533 }, reporterName: "Latha"  },
  { sector: "Flood Relief",    description: "Basement waterlogged, residents trapped on upper floor.",   urgency: 5, volunteersNeeded: 3, location: { lat: 12.9611, lng: 77.6387 }, reporterName: "Dinesh" },
  { sector: "Healthcare",      description: "Child with high fever, parents cannot afford hospital.",    urgency: 3, volunteersNeeded: 1, location: { lat: 12.9450, lng: 77.5600 }, reporterName: "Usha"   },
  { sector: "Food and Hunger", description: "Daily wage workers without food for 2 days.",              urgency: 4, volunteersNeeded: 2, location: { lat: 13.0012, lng: 77.5880 }, reporterName: "Venkat" },
  { sector: "Education",       description: "Volunteers needed for literacy camp this weekend.",          urgency: 2, volunteersNeeded: 4, location: { lat: 12.9290, lng: 77.5780 }, reporterName: "Geetha" },
  { sector: "Women Safety",    description: "Young girl lost and alone near bus stand.",                 urgency: 4, volunteersNeeded: 2, location: { lat: 12.9900, lng: 77.6100 }, reporterName: "Ravi"   },
];

const ngos = [
  { name: "Bengaluru Flood Relief Trust", sector: "Flood Relief",    darpanId: "KA/2019/0234521", location: { lat: 12.9716, lng: 77.5946 } },
  { name: "City Health Volunteers",       sector: "Healthcare",      darpanId: "KA/2020/0198432", location: { lat: 12.9612, lng: 77.6098 } },
  { name: "Namma Food Bank",              sector: "Food and Hunger", darpanId: "KA/2018/0312876", location: { lat: 12.9450, lng: 77.5700 } },
  { name: "Vidya Shakti Foundation",      sector: "Education",       darpanId: "KA/2017/0456123", location: { lat: 12.9850, lng: 77.5534 } },
  { name: "Suraksha Womens Network",      sector: "Women Safety",    darpanId: "KA/2021/0567890", location: { lat: 12.9719, lng: 77.6413 } },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  await Volunteer.deleteMany({});
  await Task.deleteMany({});
  await NGO.deleteMany({});
  console.log("Cleared old data");

  await Volunteer.insertMany(volunteers);
  await Task.insertMany(tasks);
  await NGO.insertMany(ngos);
  console.log("Seeded 20 volunteers, 10 tasks, 5 NGOs");

  await mongoose.disconnect();
  console.log("Done! Demo data is ready");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
