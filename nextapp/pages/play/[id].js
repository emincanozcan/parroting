import YouTube from "react-youtube";
import MainLayout from "../../layouts/mainLayout";
import { useEffect, useState } from "react";
import Head from "next/head";

function PlayPage({ video, videoIds }) {
  const [player, setPlayer] = useState(undefined);
  const [isPlaying, setIsPlaying] = useState(undefined);
  const [cursorLeft, setCursorLeft] = useState(0);

  const [currentCaptionIndex, setCurrentCaptionIndex] = useState(0);

  const handleOnReady = (e) => {
    setPlayer(e.target);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (player && player.hasOwnProperty("getCurrentTime")) {
        processCaptions(player.getCurrentTime());
      }
    }, 10);
    return () => clearInterval(interval);
  }, [player]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (player && player.hasOwnProperty("getCurrentTime")) {
        setCursorLeft(
          (100 * (player.getCurrentTime() - video.startsAt)) / video.duration
        );
      }
    }, 50);
    return () => clearInterval(interval);
  }, [player]);

  const seekToCaption = (index) => {
    const caption = video.captions[index];
    player.seekTo(caption.startsAt, true);
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
        caption.startsAt <= currentVideoTime &&
        caption.startsAt + caption.duration >= currentVideoTime
      ) {
        setCurrentCaptionIndex(i);
        break;
      }
    }
  };

  // TODO :update these
  const getCaptionleft = (index) => {
    return (
      (100 * (video.captions[index].startsAt - video.startsAt)) /
        video.duration +
      "%"
    );
  };

  const getCaptionWidth = (index) => {
    return (100 * video.captions[index].duration) / video.duration + "%";
  };

  const getCaptionClassName = (index) => {
    if (currentCaptionIndex - 1 === index) return "caption caption_previous";
    if (currentCaptionIndex + 1 === index) return "caption caption_next";
    if (currentCaptionIndex === index) return "caption caption_current";
    return "caption caption_hidden";
  };

  return (
    <MainLayout videoIds={videoIds}>
      <div>
        <Head>
          <title>
            {video.title.slice(0, 40 - video.title.length)} | English Shadowing
          </title>
        </Head>
        <div className="w-auto max-w-4xl mx-auto">
          <h1 className="mb-6 text-2xl truncate  font-bold">{video.title}</h1>
          {/* className={string} // defaults -> null */}
          {/* containerClassName={string} // defaults -> '' */}
          {/* onEnd={func} // defaults -> noop */}
          <YouTube
            containerClassName="w-full aspect-video mb-4"
            className="w-full h-full "
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
                start: video.startsAt,
                end: video.endsAt,
              },
            }}
            onReady={handleOnReady}
            onStateChange={handlePlayerStateChange}
          />

          <div className="flex-1 p-3 text-center bg-gray-200">
            {video.captions.map((caption, index) => {
              return (
                <div key={caption._id} className={getCaptionClassName(index)}>
                  {caption.text}
                </div>
              );
            })}
          </div>
          <div className="flex items-center my-4 space-x-4">
            <div className="relative w-full overflow-hidden h-3 border-2 border-gray-300 box-content bg-slate-200">
              <div
                style={{ left: cursorLeft + "%" }}
                className="absolute h-5 left-0 w-1.5 z-20 bg-red-600 rounded-md shadow-md -top-1 transition duration-100"
              ></div>
              {video.captions.map((caption, index) => {
                return (
                  <button
                    onClick={() => seekToCaption(index)}
                    key={caption._id}
                    className="absolute h-3 bg-slate-600 hover:scale-y-150 hover:bg-indigo-600 border border-slate-300 transition"
                    style={{
                      width: getCaptionWidth(index),
                      left: getCaptionleft(index),
                    }}
                  ></button>
                );
              })}
            </div>
            <div className="flex items-center flex-shrink-0 space-x-2">
              <button
                onClick={() => togglePlay()}
                className="inline-flex items-center justify-center h-8 text-sm text-indigo-100 bg-indigo-700 w-14 transition duration-150 rounded-md focus:shadow-outline hover:bg-indigo-800 focus:ring-2"
              >
                {isPlaying ? "Stop" : "Play"}
              </button>
              <div className="inline-block overflow-hidden rounded-md">
                <button
                  className="inline-flex items-center justify-center h-8 text-sm text-indigo-100 bg-indigo-700 border-r border-gray-800 disabled:opacity-50 w-14 transition duration-150 focus:shadow-outline hover:bg-indigo-800 focus:ring-2"
                  disabled={currentCaptionIndex === 0}
                  onClick={() => seekToCaption(currentCaptionIndex - 1)}
                >
                  Prev
                </button>
                <button
                  className="inline-flex disabled:opacity-50 justify-center items-center h-8 w-14 text-sm text-indigo-100 transition duration-150 bg-indigo-700  focus:shadow-outline hover:bg-indigo-800 focus:ring-2"
                  disabled={currentCaptionIndex >= video.captions.length - 1}
                  onClick={() => seekToCaption(currentCaptionIndex + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export async function getStaticPaths() {
  const data = (
    await (await fetch(`${process.env.DATASOURCE_URL}clip-ids`)).json()
  )["clipIds"];

  return {
    paths: data.map((id) => {
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
  const videoIds = (
    await (await fetch(`${process.env.DATASOURCE_URL}clip-ids`)).json()
  )["clipIds"];

  const clipData = await (
    await fetch(`${process.env.DATASOURCE_URL}clips/${params.id}`)
  ).json();

  const clip = clipData["clip"];
  clip.captions = clip.youtubeVideoInfo.captions
    .filter((caption) => {
      const captionStartsAt = parseFloat(caption.startsAt);
      const captionEndsAt = captionStartsAt + parseFloat(caption.duration);

      if (
        (captionStartsAt >= clip.startsAt && captionStartsAt <= clip.endsAt) ||
        (captionEndsAt >= clip.startsAt && captionEndsAt <= clip.endsAt)
      ) {
        return true;
      }
      return false;
    })
    .map((caption) => {
      caption.duration = parseFloat(caption.duration);
      caption.startsAt = parseFloat(caption.startsAt);
      return caption;
    });

  clip.duration = clip.endsAt - clip.startsAt;

  return {
    props: {
      video: clip,
      videoIds,
    },
  };
}
export default PlayPage;
