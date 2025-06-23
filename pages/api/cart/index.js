import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Missing token' });

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

  // GET: Lấy cart theo user
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('cart')
      .select('*, product:products(*)')
      .eq('user_id', user.id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // POST: Thêm item vào cart
  if (req.method === 'POST') {
    const { product_id, quantity } = req.body;

    if (!product_id || typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({ error: 'Invalid product or quantity' });
    }

    const { data, error } = await supabase
      .from('cart')
      .insert({ user_id: user.id, product_id, quantity });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ message: 'Item added to cart', item: data?.[0] });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
