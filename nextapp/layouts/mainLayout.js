import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

function MainLayout({ children, videoIds }) {
  const [randomVideoId, setRandomVideoId] = useState(0);
  useEffect(() => {
    if (randomVideoId === 0) {
      setRandomVideoId(
        videoIds[Math.floor(Math.random() * (videoIds.length - 1))]
      );
    }
  }, []);
  return (
    <div className="min-h-screen flex flex-col text-gray-800">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <header className="border-b py-6 border-gray-300 shadow-2xl bg-white">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between px-4 h-full">
          <Link href="/">
            <a>
              <h1 className="text-4xl font-extrabold">English Shadowing</h1>
            </a>
          </Link>

          <nav className="space-x-6">
            <Link href={`/play/${randomVideoId}`}>
              <a>Random Video</a>
            </Link>
          </nav>
        </div>
      </header>
      <div className="py-6 flex-1 bg-slate-100">
        <div className="max-w-7xl px-4 w-full mx-auto">{children}</div>
      </div>
    </div>
  );
}

export default MainLayout;
