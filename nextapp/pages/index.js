import Head from "next/head";
import MainLayout from "../layouts/mainLayout";
import Link from "next/link";
import Image from "next/image";
function VideoCard({ video }) {
  return (
    <Link href={`/play/${video._id}`}>
      <a>
        <div className="border border-gray-300 relative">
          <div className="w-full aspect-video relative">
            <Image
              layout="fill"
              className="object-contain"
              src={video.thumbnail}
            />
          </div>
          <div className="w-full absolute bottom-3 left-0">
            <h3 className="text-white text-center mx-4 p-3 font-bold bg-gray-900 bg-opacity-80">
              {video.title}
            </h3>
          </div>
        </div>
      </a>
    </Link>
  );
}
export default function Home({ videoList, videoIds }) {
  return (
    <MainLayout videoIds={videoIds}>
      <div>
        <Head>
          <title>English Shadowing</title>
        </Head>
        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
            {videoList.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        </main>
      </div>
    </MainLayout>
  );
}

export async function getStaticProps(context) {
  const resp = await fetch(process.env.DATASOURCE_URL + "clips");
  let data = await resp.json();

  data = data.clips.map((item) => {
    return {
      _id: item._id,
      title: item.title,
      youtubeId: item.youtubeId,
      thumbnail: item.youtubeVideoInfo.thumbnail,
    };
  });

  return {
    props: {
      videoList: data,
      videoIds: data.map((item) => item._id),
    },
  };
}
