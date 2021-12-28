import YouTube from "react-youtube";
import { useEffect, useState } from "react";

function PlayPage({ video }) {
  const [player, setPlayer] = useState(undefined);
  const [isPlaying, setIsPlaying] = useState(undefined);
  const [cursorLeft, setCursorLeft] = useState(0);

  const [previousCaptionIndex, setPreviousCaptionIndex] = useState(undefined);
  const [currentCaptionIndex, setCurrentCaptionIndex] = useState(undefined);
  const [nextCaptionIndex, setNextCaptionIndex] = useState(undefined);

  const handleOnReady = (e) => {
    setPlayer(e.target);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (player && player.hasOwnProperty("getCurrentTime")) {
        processCaptions(player.getCurrentTime());
      }
    }, 100);
    return () => clearInterval(interval);
  }, [player]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (player && player.hasOwnProperty("getCurrentTime")) {
        setCursorLeft((100 * player.getCurrentTime()) / video.duration);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [player]);

  const seekToCaption = (index) => {
    const caption = video.captions[index];

    setPreviousCaptionIndex(index > 1 ? index - 1 : null);
    setCurrentCaptionIndex(index);
    setNextCaptionIndex(index < video.captions.length - 1 ? index + 1 : null);

    player.seekTo(caption.starts_at, true);
  };

  const togglePlay = () => {
    if (player.getPlayerState() === 1) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  };

  const handlePlayerStateChange = (e) => {
    setIsPlaying(player.getPlayerState() === 1 ? true : false);
  };

  const processCaptions = (currentVideoTime) => {
    for (let i = 0; i < video.captions.length; i++) {
      const caption = video.captions[i];
      if (
        caption.starts_at <= currentVideoTime &&
        caption.ends_at >= currentVideoTime
      ) {
        setCurrentCaptionIndex(i);
        setNextCaptionIndex(video.captions[i + 1] === undefined ? null : i + 1);
        setPreviousCaptionIndex(
          video.captions[i - 1] === undefined ? null : i - 1
        );
        break;
      }
    }
  };

  const getCaptionleft = (index) => {
    return (100 * video.captions[index].starts_at) / video.duration + "%";
  };

  const getCaptionWidth = (index) => {
    return (100 * video.captions[index].duration) / video.duration + "%";
  };

  const getCaptionClassName = (index) => {
    if (previousCaptionIndex === index) return "caption caption_previous";
    if (nextCaptionIndex === index) return "caption caption_next";
    if (currentCaptionIndex === index) return "caption caption_current";
    return "caption caption_hidden";
  };

  return (
    <div>
      {/* className={string} // defaults -> null */}
      {/* containerClassName={string} // defaults -> '' */}
      {/* onEnd={func} // defaults -> noop */}
      <YouTube
        videoId={video.youtubeId}
        id={video._id} // defaults -> null
        opts={{
          playerVars: {
            playsinline: 1,
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 0,
            cc_load_policy: 0,
            showinfo: 0,
            enablejsapi: 0,
            rel: 0,
          },
        }}
        onReady={handleOnReady}
        onStateChange={handlePlayerStateChange}
      />
      <div className="my-4">
        <div
          id="timeline"
          className="h-3 relative w-full bg-slate-200 border-slate-300"
        >
          <div
            id="cursor"
            style={{ left: cursorLeft + "%" }}
            className="absolute h-4 left-0 -mt-0.5 w-1 bg-red-600 rounded-md shadow-md top-0 transition duration-100"
          ></div>
          {video.captions.map((caption, index) => {
            return (
              <button
                onClick={() => seekToCaption(index)}
                key={caption._id}
                className="bg-slate-600 h-3 absolute hover:bg-indigo-600 hover:scale-125 transition"
                style={{
                  width: getCaptionWidth(index),
                  left: getCaptionleft(index),
                }}
              ></button>
            );
          })}
        </div>
      </div>
      <div className="flex space-x-2 items-center">
        <button
          onClick={() => togglePlay()}
          className="inline-flex justify-center items-center h-8 w-14 text-sm text-indigo-100 transition duration-150 bg-indigo-700 rounded-md focus:shadow-outline hover:bg-indigo-800 focus:ring-2"
        >
          {isPlaying ? "Stop" : "Play"}
        </button>
        <div className="rounded-md overflow-hidden inline-block">
          <button
            className="inline-flex disabled:opacity-50 justify-center border-r border-gray-800 items-center h-8 w-14 text-sm text-indigo-100 transition duration-150 bg-indigo-700  focus:shadow-outline hover:bg-indigo-800 focus:ring-2"
            disabled={!Number.isInteger(previousCaptionIndex)}
            onClick={() => seekToCaption(previousCaptionIndex)}
          >
            Prev
          </button>
          <button
            className="inline-flex disabled:opacity-50 justify-center items-center h-8 w-14 text-sm text-indigo-100 transition duration-150 bg-indigo-700  focus:shadow-outline hover:bg-indigo-800 focus:ring-2"
            disabled={!Number.isInteger(nextCaptionIndex)}
            onClick={() => seekToCaption(nextCaptionIndex)}
          >
            Next
          </button>
        </div>
      </div>
      <div className="bg-gray-200 p-3 text-center space-y-3">
        {video.captions.map((caption, index) => {
          return (
            <div key={caption._id} className={getCaptionClassName(index)}>
              {caption.text}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const resp = await fetch("http://localhost");
  let data = await resp.json();
  const availableIds = data.videos.map((item) => item._id);
  return {
    paths: availableIds.map((id) => {
      return {
        params: {
          id: id,
        },
      };
    }),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const resp = await fetch("http://localhost");
  let data = await resp.json();

  // TODO: create an endpoint on backend for getOne item
  const video = data.videos.filter((item) => item._id === params.id)[0];
  video.captions = video.captions.map((caption) => {
    caption.starts_at = parseFloat(caption.startsAt);
    caption.duration = parseFloat(caption.duration);
    caption.ends_at = caption.starts_at + caption.duration;

    return caption;
  });

  return {
    props: {
      video,
    },
  };
}
export default PlayPage;
