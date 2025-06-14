import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  const { id } = req.query;

  // GET – chi tiết sản phẩm (không cần login)
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return res.status(404).json({ error: 'Product not found' });
    return res.status(200).json({ data });
  }

  // Các method còn lại yêu cầu login
  const token = req.headers.authorization?.split(' ')[1];
  const { data: { user }, error: userError } = await supabase.auth.getUser(token);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  // PUT – cập nhật
  if (req.method === 'PUT') {
    const { name, description, price, image } = req.body;
    const { data, error } = await supabase
      .from('products')
      .update({ name, description, price, image })
      .eq('id', id)
      .eq('user_id', user.id); // chỉ cho phép người tạo cập nhật

    if (error) return res.status(500).json({ error });
    return res.status(200).json({ data });
  }

  // DELETE – xoá
  if (req.method === 'DELETE') {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id); // chỉ người tạo được xoá

    if (error) return res.status(500).json({ error });
    return res.status(204).end();
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
