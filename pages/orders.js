import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import OrderItem from '@/components/OrderItem';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      if (!token) {
        setError('You must be logged in to view orders.');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to fetch orders.');
      } else {
        setOrders(data);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;
  if (error) return <p className="text-red-600 text-center mt-10">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Your Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        orders.map((order) => <OrderItem key={order.id} order={order} />)
      )}
    </div>
  );
}
