import Head from 'next/head';
import ProductForm from '../../components/ProductForm';

export default function AddProductPage() {
  return (
    <div>
      <Head>
        <title>Add Product</title>
      </Head>

      <ProductForm />
    </div>
  );
}
