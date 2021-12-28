import mongoose from "mongoose";
const Schema = mongoose.Schema;

const clipSchema = new Schema(
  {
    youtubeId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    startsAt: {
      type: Number,
      required: true,
    },
    endsAt: {
      type: Number,
      required: true,
    },
    youtubeVideoInfo: {
      title: {
        type: String,
        required: true,
      },
      duration: {
        type: Number,
        required: true,
      },
      thumbnail: {
        type: String,
        required: true,
      },
      captions: [
        {
          text: {
            type: String,
            required: true,
          },
          startsAt: {
            type: String,
            required: true,
          },
          duration: {
            type: String,
            required: true,
          },
        },
      ],
      statistics: {
        viewCount: Number,
        likeCount: Number,
        favoriteCount: Number,
        commentCount: Number,
      },
    },
  },
  { timestamps: true }
);

const Clip = mongoose.model("Clip", clipSchema);
export default Clip;
