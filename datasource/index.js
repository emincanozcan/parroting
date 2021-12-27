import fs from "fs";
import mongoose from "mongoose";
import express from "express";
import fetch from "node-fetch";
import Video from "./models/video.js";
import { exec } from "child_process";

const app = express();
const mongoUrl =
  process.env.ME_CONFIG_MONGODB_URL + "englishimitationdb?authSource=admin";

mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    throw err;
  });

// connect to mongodb

app.get("/", async (req, res) => {
  const videos = await Video.find({});
  return res.json({ videos });
});

app.get("/generate", async (req, res) => {
  // const videoIds = req.query.youtubeIds;
  // return res.send({ videoIds });

  const videoIds = [
    "vst2S09Ekjc",
    "DpJ8vsgok0o",
    "wizgxRBfVTY",
    "r8E1Hq5tktg",
    "v1xXlxDHWPU",
    "dqv5i2zpoco",
    "ji888wNv1jw",
    "3fbhVPnhX-4",
    "LLGeo_HPNn4",
    "3Ml-JTgFW1I",
    "lpZBwCp8rYc",
    "M6T69LFIg1k",
    "uLJPdI4f6wE",
    "oBo5ANETAdk",
    "UUtBsDIvBjM",
    "bhl6y3K_rFc",
  ];

  const videoIdsJoined = videoIds.join(",");
  const youtubeApiKey = process.env.YOUTUBE_API_KEY;
  // TODO: Implement pagination
  const youtubeRes = await (
    await fetch(
      `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoIdsJoined}&key=${youtubeApiKey}`
    )
  ).json();

  const videoData = {};
  youtubeRes.items.forEach((item) => {
    let duration = item.contentDetails.duration;
    duration = duration.slice(2, -1);
    let durationInSec = 0;

    const hours = duration.split("H");
    if (hours.length > 1) {
      durationInSec += parseInt(hours[0]) * 60 * 60;
      duration = hours[1];
    }

    const minutes = duration.split("M");
    if (minutes.length > 1) {
      durationInSec += parseInt(minutes[0]) * 60 * 60;
      duration = minutes[1];
    }

    durationInSec += parseInt(duration);

    videoData[item.id] = {
      youtubeId: item.id,
      title: item.snippet.title,
      duration: durationInSec,
      statistics: item.statistics,
      captions: [],
    };
  });

  exec(
    "python3 youtube-transcript-generator.py " + videoIds.join(" "),
    async (err, stdout, stderr) => {
      const captionsPath = stdout.replace("\n", "");
      const captions = JSON.parse(fs.readFileSync(captionsPath, "utf-8"))[0];

      for (const videoId of videoIds) {
        captions[videoId].forEach((el) => {
          videoData[videoId]["captions"].push({
            startsAt: el.start,
            duration: el.duration,
            text: el.text,
          });
        });
      }

      try {
        const r = await Video.create(Object.values(videoData));
        return res.json({ r });
      } catch (e) {
        return res.json({ e });
      }
    }
  );
});
