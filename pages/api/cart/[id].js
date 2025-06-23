import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const { data: { user } } = await supabase.auth.getUser(token);

  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { id } = req.query;

  if (req.method === 'PUT') {
    const { quantity } = req.body;
    const { data, error } = await supabase
      .from('cart')
      .update({ quantity })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) return res.status(500).json({ error });
    return res.status(200).json(data);
  }

  if (req.method === 'DELETE') {
    const { data, error } = await supabase
      .from('cart')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) return res.status(500).json({ error });
    return res.status(200).json(data);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
