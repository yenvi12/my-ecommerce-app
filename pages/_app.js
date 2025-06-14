import '../styles/global.css';
import Navbar from '../components/Navbar';


export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Component {...pageProps} />
      </main>
    </>
  );
}