import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProductForm from '../../../components/ProductForm';

export default function EditProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        setError(err.message || 'Error loading product.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [router.isReady, id]);

  return (
    <div>
      <Head>
        <title>Edit Product</title>
      </Head>

      {error && (
        <p className="text-center mt-10 text-red-600 font-semibold">{error}</p>
      )}

      {loading && (
        <p className="text-center mt-10 text-gray-600">Loading product...</p>
      )}

      {!loading && product && <ProductForm productData={product} />}
    </div>
  );
}
