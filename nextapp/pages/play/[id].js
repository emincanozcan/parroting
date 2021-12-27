function PlayPage({ video }) {
  return <div>{video.title}</div>;
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

  return {
    props: {
      video,
    },
  };
}
export default PlayPage;
