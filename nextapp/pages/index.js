import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import MainLayout from "../layouts/mainLayout";
function VideoCard({ video }) {
  const imageUrl = `https://i.ytimg.com/vi/${video.youtubeId}/maxresdefault.jpg`;
  return (
    <Link href={`/play/${video._id}`}>
      <a>
        <div className="border border-gray-300 relative">
          <div className="w-full aspect-video relative">
            <Image layout="fill" className="object-contain" src={imageUrl} />
          </div>
          <div className="w-full absolute bottom-3 left-0">
            <h3 className="text-white text-center mx-4 p-3 font-bold bg-gray-900 bg-opacity-80 ">
              {video.title}
            </h3>
          </div>
        </div>
      </a>
    </Link>
  );
}
export default function Home({ videoList }) {
  return (
    <div>
      <Head>
        <title>English Imitation</title>
      </Head>
      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
          {videoList.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps(context) {
  const resp = await fetch("http://localhost");
  let data = await resp.json();
  data = data.videos.map((item) => {
    return {
      _id: item._id,
      duration: item.duration,
      title: item.title,
      youtubeId: item.youtubeId,
    };
  });

  return {
    props: {
      videoList: data,
      videoIds: data.map((item) => item._id),
    },
  };
}
