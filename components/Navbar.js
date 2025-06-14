import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isMounted, setIsMounted] = useState(false); // 👈 để tránh hydration mismatch

  useEffect(() => {
    setIsMounted(true); // Đánh dấu đã mount (chạy trên client)

    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  // ❌ Tránh render sớm trước khi client mount
  if (!isMounted) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <nav className="bg-blue-600 text-white flex justify-between items-center px-6 py-4 shadow">
      <Link href="/" className="font-bold text-lg hover:underline">
        EcomApp
      </Link>

      <div className="flex gap-4 items-center">
        {user && (
          <Link
            href="/products/add"
            className="hover:underline text-white font-medium"
          >
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
