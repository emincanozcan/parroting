import mongoose from "mongoose";
const Schema = mongoose.Schema;

const videoSchema = new Schema(
  {
    youtubeId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    statistics: {
      viewCount: Number,
      likeCount: Number,
      favoriteCount: Number,
      commentCount: Number,
    },
    captions: [
      {
        text: {
          type: String,
          required: true,
        },
        startsAt: {
          type: String, // Look at the next comment...
          required: true,
        },
        duration: {
          type: String, // should be float but I think mongoose doesn't have it.
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Video = mongoose.model("Video", videoSchema);
export default Video;
