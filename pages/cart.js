import { useEffect, useState } from 'react';
import CartItem from '@/components/CartItem';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const router = useRouter();

  const fetchCart = async () => {
    const session = await supabase.auth.getSession();
    const res = await fetch('/api/cart', {
      headers: {
        Authorization: `Bearer ${session.data.session.access_token}`
      }
    });
    const data = await res.json();
    setCartItems(data);
  };

  const removeItem = async (id) => {
    const session = await supabase.auth.getSession();
    await fetch(`/api/cart/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${session.data.session.access_token}`
      }
    });
    fetchCart();
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return;
    const session = await supabase.auth.getSession();
    await fetch(`/api/cart/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.data.session.access_token}`
      },
      body: JSON.stringify({ quantity })
    });
    fetchCart();
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">🛒 Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onRemove={removeItem}
              onUpdate={updateQuantity}
            />
          ))}

          <div className="mt-6 border-t pt-4 flex justify-between items-center">
            <p className="text-xl font-semibold text-gray-800">
              Total: <span className="text-green-600">${total.toFixed(2)}</span>
            </p>
            <button
              onClick={() => router.push('/checkout')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded shadow transition duration-200"
            >
              Go to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
