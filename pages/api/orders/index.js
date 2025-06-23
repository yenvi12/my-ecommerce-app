import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Missing auth token' });
  }

  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // GET: Lấy danh sách đơn hàng của user
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  }

  // POST: Tạo đơn hàng mới
  if (req.method === 'POST') {
    const { products, total } = req.body;

    // Kiểm tra payload
    if (!Array.isArray(products) || typeof total !== 'number') {
      return res.status(400).json({ error: 'Invalid order payload' });
    }

    // Thêm đơn hàng mới
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          user_id: user.id,
          products,
          total,
          status: 'unpaid',
        }
      ])
      .select('*');

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // ❌ Không xoá giỏ hàng nữa
    // const { error: cartError } = await supabase
    //   .from('cart')
    //   .delete()
    //   .eq('user_id', user.id);

    // if (cartError) {
    //   return res.status(500).json({ error: 'Order saved, but failed to clear cart' });
    // }

    return res.status(201).json({
      message: 'Order placed successfully',
      order: data?.[0] || null
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
