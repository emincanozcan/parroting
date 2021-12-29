import mongoose from "mongoose";
import express from "express";
import Clip from "./models/clip.js";
import fetchYoutubeVideoInfo from "./helpers/fetchYoutubeVideoInfo.js";

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
  return res.json({ status: "ok" });
});

app.get("/clips", async (req, res) => {
  const clips = await Clip.find({});
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

function baseVideo(youtubeId, clips = []) {
  return { youtubeId, clips };
}
function getBaseVideos() {
  return {
    vst2S09Ekjc: baseVideo("vst2S09Ekjc"),
    A3JCB49SlSo: baseVideo("A3JCB49SlSo", [
      { startsAt: 1, endsAt: 31 },
      { startsAt: 37, endsAt: 53 },
    ]),
    DpJ8vsgok0o: baseVideo("DpJ8vsgok0o"),
    wizgxRBfVTY: baseVideo("wizgxRBfVTY"),
    r8E1Hq5tktg: baseVideo("r8E1Hq5tktg"),
    v1xXlxDHWPU: baseVideo("v1xXlxDHWPU"),
    dqv5i2zpoco: baseVideo("dqv5i2zpoco"),
    ji888wNv1jw: baseVideo("ji888wNv1jw"),
    "3fbhVPnhX-4": baseVideo("3fbhVPnhX-4"),
    LLGeo_HPNn4: baseVideo("LLGeo_HPNn4"),
    "3Ml-JTgFW1I": baseVideo("3Ml-JTgFW1I"),
    lpZBwCp8rYc: baseVideo("lpZBwCp8rYc"),
    M6T69LFIg1k: baseVideo("M6T69LFIg1k"),
    uLJPdI4f6wE: baseVideo("uLJPdI4f6wE"),
    oBo5ANETAdk: baseVideo("oBo5ANETAdk"),
    UUtBsDIvBjM: baseVideo("UUtBsDIvBjM"),
    bhl6y3K_rFc: baseVideo("bhl6y3K_rFc"),
    "v_bnu-6oOwc": baseVideo("v_bnu-6oOwc"),
    "CPY-Ou8MR44": baseVideo("CPY-Ou8MR44"),
    "5fZU0DQYV34": baseVideo("5fZU0DQYV34"),
    "3vofUNJo8hQ": baseVideo("3vofUNJo8hQ"),
    cwB5R5FOOvU: baseVideo("cwB5R5FOOvU"),
    SIUi8GDUlaE: baseVideo("SIUi8GDUlaE"),
    "kjYpHcJU-q0": baseVideo("kjYpHcJU-q0"),
    UVrrZZPAkvY: baseVideo("UVrrZZPAkvY"),

    "6XvmhE1J9PY": baseVideo("6XvmhE1J9PY"),
    "984VkHzXl8w": baseVideo("984VkHzXl8w"),
    "cdeXlrq-tNw": baseVideo("cdeXlrq-tNw"),
    Ym6whrAw8wU: baseVideo("Ym6whrAw8wU"),
    x6fIseKzzH0: baseVideo("x6fIseKzzH0"),
    "2_AMEAnWyRk": baseVideo("2_AMEAnWyRk"),
    IyPr0VCiqsI: baseVideo("IyPr0VCiqsI"),
    "PYJ22-YYNW8": baseVideo("PYJ22-YYNW8"),
    "rbZ4aLq4-Lg": baseVideo("rbZ4aLq4-Lg"),
    xEhjqUkYgx0: baseVideo("xEhjqUkYgx0"),
    _mUvG6x53VM: baseVideo("_mUvG6x53VM"),
    "1GlKdGZcP1E": baseVideo("1GlKdGZcP1E", [{ startsAt: 0, endsAt: 105 }]),
    mOF54rIIw0Q: baseVideo("mOF54rIIw0Q", [{ startsAt: 8, endsAt: 177 }]),
    I6vQtLdDbKI: baseVideo("I6vQtLdDbKI", [{ startsAt: 59, endsAt: 216 }]),
    uZuwFAQpgZc: baseVideo("uZuwFAQpgZc", [{ startsAt: 0, endsAt: 134 }]),
    beEPuUq_RdY: baseVideo("beEPuUq_RdY", [{ startsAt: 3, endsAt: 140 }]),
    _rdINNHLYaQ: baseVideo("_rdINNHLYaQ", [
      { startsAt: 0, endsAt: 163, title: "Machine Learning" },
    ]),

    "4Ix5g6Ictvs": baseVideo("4Ix5g6Ictvs", [
      { startsAt: 0, endsAt: 92, title: "Great Advice for New Graudates" },
    ]),

    "1k89OTpDvIU": baseVideo("1k89OTpDvIU", [
      { startsAt: 12, endsAt: 142, title: "Creating DIY Projects - Fawn Qiu" },
    ]),
    "0eD6WEpCSPg": baseVideo("0eD6WEpCSPg", [
      { startsAt: 0, endsAt: 102, title: "True Richness" },
    ]),
    "FI-oPZnPRqI": baseVideo("FI-oPZnPRqI", [
      { startsAt: 7, endsAt: 113, title: "Improve Your Concentration" },
    ]),
    iyEbvehRPhY: baseVideo("iyEbvehRPhY", [{ startsAt: 1, endsAt: 151 }]),
    "8Nf9npmu3Xg": baseVideo("8Nf9npmu3Xg", [
      { startsAt: 0, endsAt: 113, title: "Manage Your Career with Urgency" },
    ]),
  };
}

app.get("/generate", async (req, res) => {
  await Clip.deleteMany();

  const baseVideoData = getBaseVideos();
  const youtubeVideoInfo = await fetchYoutubeVideoInfo(
    Object.keys(baseVideoData)
  );

  const clipData = [];

  Object.values(baseVideoData).forEach((video) => {
    const youtubeData = youtubeVideoInfo[video.youtubeId];
    if (video.clips.length > 0) {
      video.clips.forEach((clip) => {
        clipData.push({
          youtubeId: video.youtubeId,
          youtubeVideoInfo: youtubeData,
          title: youtubeData.title,
          startsAt: clip.startsAt,
          endsAt: clip.endsAt,
        });
      });
    } else {
      clipData.push({
        youtubeId: video.youtubeId,
        youtubeVideoInfo: youtubeData,
        title: youtubeData.title,
        startsAt: 0,
        endsAt: youtubeData.duration,
      });
    }
  });
  try {
    const save = await Clip.create(clipData);
    return res.json({ save });
  } catch (e) {
    return res.json({ e });
  }
});
