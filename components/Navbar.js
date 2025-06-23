import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  if (!isMounted) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow">
      <Link href="/" className="text-xl font-bold hover:underline">
        EcomApp
      </Link>

      <div className="flex items-center gap-4">
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/cart" className="hover:underline">Cart</Link>
        {user && <Link href="/orders" className="hover:underline">Orders</Link>}
        {user && (
          <Link href="/products/add" className="hover:underline">
            Add Product
          </Link>
        )}

        {user ? (
          <>
            <span className="text-sm hidden sm:inline">{user.email}</span>
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/auth/login"
            className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
