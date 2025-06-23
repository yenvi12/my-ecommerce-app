import '../styles/global.css';
import Navbar from '../components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // 🔑 Quan trọng: cần import CSS của toastify

export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Component {...pageProps} />
      </main>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
