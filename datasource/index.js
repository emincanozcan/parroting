import mongoose from "mongoose";
import express from "express";
import Clip from "./models/clip.js";
import seed from "./helpers/seed.js";

const app = express();
const mongoUrl =
  process.env.ME_CONFIG_MONGODB_URL + "englishimitationdb?authSource=admin";

mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async (result) => {
    if (process.env.SEED && parseInt(process.env.SEED) === 1) {
      console.log("Seeding...");
      await seed();
      console.log("Seeding is completed.");
    }

    app.listen(3000);
  })
  .catch((err) => {
    throw err;
  });

app.get("/", async (req, res) => {
  return res.json({ status: "ok" });
});

app.get("/clips", async (req, res) => {
  const clips = (await Clip.find({})).sort(() =>
    Math.random() > 0.5 ? 1 : -1
  );
  return res.json({ clips });
});

app.get("/clip-ids", async (req, res) => {
  const clipIds = (await Clip.find({}, { _id: 1 })).map((c) => c._id);
  return res.json({ clipIds });
});

app.get("/clips/:clipId", async (req, res) => {
  const clip = await Clip.findById(req.params.clipId);
  return res.json({ clip });
});

app.get("/seed", async (req, res) => {
  await Clip.deleteMany();
  const clipData = await seed();
  try {
    const save = await Clip.create(clipData);
    return res.json({ save });
  } catch (e) {
    return res.json({ e });
  }
});
