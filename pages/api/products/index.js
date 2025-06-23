// pages/api/products/index.js
import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase.from('products').select('*');

      if (error) {
        console.error('❌ Error fetching products:', error);
        return res.status(500).json({ error: error.message || 'Failed to fetch products' });
      }

      return res.status(200).json({ data });
    } catch (err) {
      console.error('🔥 Server error in GET /products:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, description, price, image } = req.body;
      const token = req.headers.authorization?.split(' ')[1];
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);

      if (authError || !user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { data, error } = await supabase
        .from('products')
        .insert([{ name, description, price, image, user_id: user.id }])
        .select('*');

      if (error) {
        console.error('❌ Insert error:', error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json({ data });
    } catch (err) {
      console.error('🔥 Server error in POST /products:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
