import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!router.isReady || !id || typeof id !== 'string') return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch product');
        setProduct(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [router.isReady, id]);

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading product...</p>;

  if (error)
    return <p className="text-center text-red-600 mt-10 font-semibold">{error}</p>;

  if (!product)
    return <p className="text-center text-gray-500 mt-10">Product not found.</p>;

  return (
    <>
      <Head>
        <title>{product.name}</title>
        <meta name="description" content={product.description} />
      </Head>

      <Navbar />

      <div className="max-w-4xl mx-auto mt-10 bg-white rounded-lg shadow p-6 flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2">
          <img
            src={product.image || '/placeholder.png'}
            alt={product.name}
            className="w-full h-64 object-contain rounded bg-gray-100"
          />
        </div>
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-green-600 text-xl font-semibold">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-gray-700">{product.description}</p>

          <div className="flex gap-4 mt-6">
            <Link
              href={`/products/edit/${product.id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Edit
            </Link>
            <Link
              href="/"
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Back to List
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
