import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

const ProductForm = ({ productData = {} }) => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: productData.name || '',
    description: productData.description || '',
    price: productData.price || '',
    image: productData.image || '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(productData.image || '');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    previewFile(file);
  };

  const previewFile = (file) => {
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    previewFile(file);
    setDragOver(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    if (!form.name.trim() || !form.description.trim()) {
      setMessage('Name and description are required.');
      setIsSubmitting(false);
      return;
    }

    if (isNaN(form.price) || Number(form.price) <= 0) {
      setMessage('Price must be a positive number.');
      setIsSubmitting(false);
      return;
    }

    let imageUrl = form.image;

    if (selectedFile) {
      const uploadData = new FormData();
      uploadData.append('file', selectedFile);
      uploadData.append('upload_preset', 'product_upload');

      try {
        const res = await fetch(
          'https://api.cloudinary.com/v1_1/de7ahjv6e/image/upload',
          {
            method: 'POST',
            body: uploadData,
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error('Image upload failed');
        imageUrl = data.secure_url;
      } catch (err) {
        setMessage(`Error uploading image: ${err.message}`);
        setIsSubmitting(false);
        return;
      }
    }

    const payload = { ...form, image: imageUrl };
    const endpoint = productData.id
      ? `/api/products/${productData.id}`
      : '/api/products';
    const method = productData.id ? 'PUT' : 'POST';

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error('Login required.');

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Error saving product');

      setMessage('Success!');
      router.push('/');
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEdit = !!productData.id;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white p-6 rounded shadow space-y-4"
    >
      <h2 className="text-2xl font-bold text-center mb-2">
        {isEdit ? 'Edit Product' : 'Add Product'}
      </h2>

      {message && (
        <div className="text-sm font-medium text-center p-2 rounded bg-yellow-100 border">
          {message}
        </div>
      )}

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        required
        placeholder="Name"
        className="w-full border px-4 py-2 rounded"
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        required
        placeholder="Description"
        className="w-full border px-4 py-2 rounded"
      />

      <input
        name="price"
        type="number"
        value={form.price}
        onChange={handleChange}
        required
        placeholder="Price"
        className="w-full border px-4 py-2 rounded"
      />

      {/* Drag & drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`w-full h-40 border-2 border-dashed rounded flex items-center justify-center ${
          dragOver ? 'bg-blue-100' : 'bg-gray-50'
        }`}
      >
        {filePreview ? (
          <img src={filePreview} alt="Preview" className="max-h-36" />
        ) : (
          <p className="text-gray-500">Drag & drop an image here</p>
        )}
      </div>

      <div className="text-center text-sm text-gray-500">or</div>

      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        className="block w-full"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        {isSubmitting
          ? 'Saving...'
          : isEdit
          ? 'Update Product'
          : 'Add Product'}
      </button>
    </form>
  );
};

export default ProductForm;
