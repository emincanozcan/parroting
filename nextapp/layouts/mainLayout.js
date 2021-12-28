import Head from "next/head";
import Link from "next/link";

function MainLayout({ children, videoIds }) {
  const randomVideoId = videoIds[Math.floor(Math.random() * videoIds.length)];
  return (
    <div className="min-h-screen flex flex-col text-gray-800">
      <header className="border-b py-6 border-gray-300 shadow-2xl bg-white">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between px-4 h-full">
          <Link href="/">
            <a>
              <h1 className="text-4xl font-black">English Imitation</h1>
            </a>
          </Link>

          <nav className="space-x-6">
            <Link href={`/play/${randomVideoId}`}>
              <a>Open Random Video</a>
            </Link>
          </nav>
        </div>
      </header>

      <div className="py-6 flex-1 bg-slate-100">
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Ubuntu&display=optional"
            rel="stylesheet"
          />
        </Head>

        <div className="max-w-7xl px-4 w-full mx-auto">{children}</div>
      </div>
    </div>
  );
}

export default MainLayout;
