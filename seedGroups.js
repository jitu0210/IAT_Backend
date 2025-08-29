import mongoose from "mongoose";
import dotenv from "dotenv";
import Group from "./models/group.model.js";

dotenv.config(); // load .env

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  console.error("❌ No MongoDB URI found in .env (MONGO_URI missing)");
  process.exit(1);
}

const predefinedGroups = [
  { name: "Path finder", members: [], ratings: [] },
  { name: "Nova", members: [], ratings: [] },
  { name: "Fusion force", members: [], ratings: [] },
  { name: "Wit squad", members: [], ratings: [] },
  { name: "Explorers", members: [], ratings: [] }
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("✅ MongoDB connected");

    for (const g of predefinedGroups) {
      const exists = await Group.findOne({ name: g.name });
      if (!exists) {
        await Group.create(g);
        console.log(`Inserted group: ${g.name}`);
      } else {
        console.log(`Group already exists: ${g.name}`);
      }
    }

    console.log("🚀 Seeding complete");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};

seed();
