// pages/checkout.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-toastify';

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      const session = await supabase.auth.getSession();
      const res = await fetch('/api/cart', {
        headers: {
          Authorization: `Bearer ${session.data.session.access_token}`,
        },
      });
      const data = await res.json();
      setCartItems(data);
      setLoading(false);
    };

    fetchCart();
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    try {
      const session = await supabase.auth.getSession();
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.data.session.access_token}`,
        },
        body: JSON.stringify({
          products: cartItems.map((item) => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.image || null,
          })),
          total,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to place order');

      toast.success('🎉 Order placed successfully!');
      router.push('/orders');
    } catch (err) {
      toast.error(`❌ ${err.message}`);
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) return <p className="text-center">Loading cart...</p>;
  if (cartItems.length === 0) return <p className="text-center">Your cart is empty.</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md mt-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-700">Checkout</h2>

      <ul className="divide-y space-y-4">
        {cartItems.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={item.product.image || 'https://res.cloudinary.com/de7ahjv6e/image/upload/v1710000000/default_product.png'}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded border"
              />
              <div>
                <p className="font-semibold text-gray-900">{item.product.name}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
            </div>
            <span className="text-lg font-bold text-green-700">
              ${(item.product.price * item.quantity).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex justify-between items-center text-xl font-semibold border-t pt-4">
        <span>Total:</span>
        <span className="text-blue-600">${total.toFixed(2)}</span>
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={placingOrder}
        className={`mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-lg font-bold transition ${
          placingOrder ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {placingOrder ? 'Placing Order...' : 'Place Order'}
      </button>
    </div>
  );
}
