const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const Bus = require('./models/Bus');
const Conductor = require('./models/Conductor');
const AdminAuth = require('./models/AdminAuth');
const BusStatus = require('./models/BusStatus');

function generatePassword() {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let pwd = '';
  for (let i = 0; i < 6; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pwd;
}

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  await Bus.deleteMany({});
  await Conductor.deleteMany({});
  await AdminAuth.deleteMany({});
  await BusStatus.deleteMany({});

  const buses = [
    { busNo: "TS01AB0001", routeNo: "101", type: "metro", capacity: 40, route: "Central ↔ North" },
    { busNo: "TS02CD0002", routeNo: "102A", type: "express", capacity: 35, route: "Central ↔ Airport" },
    { busNo: "TS03EF0003", routeNo: "103B", type: "local", capacity: 45, route: "East Loop" },
    { busNo: "TS04GH0004", routeNo: "104", type: "intercity", capacity: 50, route: "Downtown ↔ Outskirts" },
    { busNo: "TS05IJ0005", routeNo: "105", type: "metro", capacity: 42, route: "West Corridor" },
    { busNo: "TS06KL0006", routeNo: "106C", type: "express", capacity: 38, route: "South Line" },
    { busNo: "TS07MN0007", routeNo: "107", type: "local", capacity: 48, route: "Ring Road" },
    { busNo: "TS08OP0008", routeNo: "108B", type: "intercity", capacity: 44, route: "Highway Express" },
    { busNo: "TS09QR0009", routeNo: "109", type: "metro", capacity: 40, route: "Science Park ↔ City Center" },
    { busNo: "TS10ST0010", routeNo: "110A", type: "local", capacity: 47, route: "Market ↔ Railway Station" }
  ];
  await Bus.insertMany(buses);

  const conductors = [
    { conductorId: "C001", name: "Ravi Kumar", phone: "9876543210" },
    { conductorId: "C002", name: "Sita Rao", phone: "9876504321" },
    { conductorId: "C003", name: "Arun Patel", phone: "9876512345" },
    { conductorId: "C004", name: "Meena Shah", phone: "9876523456" },
    { conductorId: "C005", name: "Kiran Reddy", phone: "9876534567" },
    { conductorId: "C006", name: "Ajay Nair", phone: "9876545678" },
    { conductorId: "C007", name: "Divya Sharma", phone: "9876556789" },
    { conductorId: "C008", name: "Suresh Yadav", phone: "9876567890" },
    { conductorId: "C009", name: "Anjali Verma", phone: "9876578901" },
    { conductorId: "C010", name: "Manoj Gupta", phone: "9876589012" }
  ];
  const insertedConductors = await Conductor.insertMany(conductors);

  for (let conductor of insertedConductors) {
    const rawPwd = generatePassword();
    const hash = await bcrypt.hash(rawPwd, 10);
    await AdminAuth.create({
      conductorId: conductor._id,
      username: conductor.conductorId,
      passwordHash: hash,
      immutable: true
    });
    console.log(`Conductor ${conductor.conductorId} password: ${rawPwd}`);
  }

  console.log("✅ Seeding complete");
  mongoose.disconnect();
}

seed();
