import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
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
            <h3 className="text-white text-center mx-4 p-3 font-bold bg-gray-900 bg-opacity-80">
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
    <div className="container">
      <Head>
        <title>English Imitation</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="text-2xl">Hola!</h1>

        <div className="grid grid-cols-3 gap-4">
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
    },
  };
}
