import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch products');
        setProducts(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading products...</p>;

  if (error)
    return <p className="text-center text-red-600 font-semibold">{error}</p>;

  return (
    <div>
      <Head>
        <title>Product List</title>
        <meta name="description" content="List of all products" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-center text-3xl font-bold text-yellow-600 my-6">
        Available Products
      </h1>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded w-2/3 max-w-xl"
        />
      </div>

      {currentItems.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4 pb-8">
          {currentItems.map((product) => (
            <div
              key={product.id}
              className="flex flex-col bg-[#c6e7f8] rounded-lg shadow-md hover:shadow-lg transition hover:-translate-y-1"
            >
              <img
                src={product.image || '/placeholder.png'}
                alt={product.name}
                className="w-full h-48 object-contain bg-white"
              />
              <div className="p-4 flex-grow">
                <Link
                  href={`/products/${product.id}`}
                  className="block text-xl font-semibold text-blue-600 hover:underline"
                >
                  {product.name}
                </Link>
                <p className="text-green-600 font-bold text-lg mt-1">
                  ${product.price.toFixed(2)}
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  {product.description?.substring(0, 100)}...
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-3 flex justify-end">
                <Link
                  href={`/products/edit/${product.id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold text-sm"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mb-10">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
