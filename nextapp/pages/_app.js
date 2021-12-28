import MainLayout from "../layouts/mainLayout";
import "../styles/global.css";
function App({ Component, pageProps }) {
  return (
    <MainLayout {...pageProps}>
      <Component {...pageProps} />
    </MainLayout>
  );
}

export default App;
