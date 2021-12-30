import MainLayout from "../layouts/mainLayout";

export default function About({ videoIds }) {
  return (
    <MainLayout videoIds={videoIds}>
      <article className="prose prose-slate md:prose-lg px-4 py-8 shadow-lg rounded-lg bg-white mx-auto prose-a:text-blue-700 hover:prose-a:text-blue-900 prose-a:transition-all">
        <h2>About Parroting 🦜</h2>
        Parroting is a website that helps people to improve their English
        speaking fluency and pronunciation by using a technique called
        `shadowing`.
        <h3>What is Shadowing?</h3>
        <p>
          Shadowing is a technique that is based on listening and repeating.
          Think it like you are being a parrot 🦜. </br>If you are interested, there
          are articles about this technique on the internet. It is also called{" "}
          <i>Imitation</i> / <i>Echoing</i>, so you can use these keywords while
          searching.
        </p>
        <h3>Why I Created It? What Is The Future Of Project?</h3>
        <p>
          As a developer and as a person who wants to improve English speaking
          skills, I created this hobby project for myself and I shared it.
        </p>
        <p>
          Currently, it is okay for me. Also, there are lots of things that can
          be done about this project in the future (mobile app, more content,
          better design, better search, history, etc.) I might work on them, but
          I am not sure yet.
        </p>
        <h3>Contact</h3>
        <p>
          You can send me an email at{" "}
          <a href="mailto:emincan@emincanozcan.com">emincan@emincanozcan.com</a>
          .
          <br />
          <br />
          For more,{" "}
          <a href="https://emincanozcan.com" target="_blank">
            click here to go to my personal website
          </a>
          .
        </p>
      </article>
    </MainLayout>
  );
}

export async function getStaticProps() {
  const videoIds = (
    await (await fetch(`${process.env.DATASOURCE_URL}clip-ids`)).json()
  )["clipIds"];

  return {
    props: { videoIds },
  };
}
