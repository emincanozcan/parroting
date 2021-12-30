import util from "util";
import fetch from "node-fetch";
import child_process from "child_process";
import fs from "fs";
const exec = util.promisify(child_process.exec);

function getDurationByYoutubeDuration(duration) {
  duration = duration.replace("PT", "").replace("S", "");
  let durationInSec = 0;

  const hours = duration.split("H");
  if (hours.length > 1) {
    durationInSec += parseInt(hours[0]) * 60 * 60;
    duration = hours[1];
  }

  const minutes = duration.split("M");
  if (minutes.length > 1) {
    durationInSec += parseInt(minutes[0]) * 60;
    duration = minutes[1];
  }

  if (duration) {
    durationInSec += parseInt(duration);
  }

  return durationInSec;
}

async function fetchVideoCaptions(youtubeVideoIds) {
  const ret = {};
  const { err, stdout, stderr } = await exec(
    "python3 youtube-transcript-generator.py " + youtubeVideoIds.join(" ")
  );

  if (err) throw err;
  if (stderr) throw err;

  const captionsPath = stdout.replace("\n", "");
  const captions = JSON.parse(fs.readFileSync(captionsPath, "utf-8"));
  for (const videoId of youtubeVideoIds) {
    ret[videoId] = [];
    captions[videoId].forEach((el) => {
      ret[videoId].push({
        startsAt: el.start,
        duration: el.duration,
        text: el.text,
      });
    });
  }

  return ret;
}
async function fetchYoutubeVideoInfo(youtubeVideoIds) {
  const videoIdsJoined = youtubeVideoIds.join(",");
  const youtubeApiKey = process.env.YOUTUBE_API_KEY;
  const youtubeRes = await (
    await fetch(
      `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoIdsJoined}&key=${youtubeApiKey}`
    )
  ).json();

  const captions = await fetchVideoCaptions(youtubeVideoIds);

  const ret = {};
  youtubeRes.items.forEach((youtubeItem) => {
    ret[youtubeItem.id] = {
      title: youtubeItem.snippet.title,
      duration: getDurationByYoutubeDuration(
        youtubeItem.contentDetails.duration
      ),
      statistics: youtubeItem.statistics,
      captions: captions[youtubeItem.id],
    };

    let maxW = 0;
    Object.values(youtubeItem.snippet.thumbnails).forEach((thumbnail) => {
      if (thumbnail.width > maxW && maxW < 720) {
        ret[youtubeItem.id].thumbnail = thumbnail.url;
        maxW = thumbnail.width;
      }
    });
  });

  return ret;
}

export default fetchYoutubeVideoInfo;
