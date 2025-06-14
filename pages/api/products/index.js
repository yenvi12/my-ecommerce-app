// GET and POST API for products
import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('products').select('*');
    if (error) return res.status(500).json({ error });
    return res.status(200).json({ data });
  }

  if (req.method === 'POST') {
    const { name, description, price, image } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return res.status(401).json({ error: 'Not authenticated' });

    const { data, error } = await supabase.from('products').insert([{ name, description, price, image, user_id: user.id }]);
    if (error) return res.status(500).json({ error });
    return res.status(201).json({ data });
  }

  return res.status(405).end();
}
