import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  const { id } = req.query;

  // 🟢 GET – Public: lấy chi tiết sản phẩm
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data)
      return res.status(404).json({ error: 'Product not found' });

    return res.status(200).json({ data });
  }

  // 🛡️ Các method PUT/DELETE yêu cầu xác thực
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Missing access token' });
  }

  const { data: userData, error: authError } = await supabase.auth.getUser(token);
  const user = userData?.user;

  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // ✏️ PUT – cập nhật sản phẩm
  if (req.method === 'PUT') {
    const { name, description, price, image } = req.body;

    const { data, error } = await supabase
      .from('products')
      .update({ name, description, price, image })
      .eq('id', id)
      .eq('user_id', user.id); // bảo vệ: chỉ người tạo mới sửa

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ data });
  }

  // ❌ DELETE – xoá sản phẩm
  if (req.method === 'DELETE') {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id); // bảo vệ: chỉ người tạo mới xoá

    if (error) return res.status(500).json({ error: error.message });

    return res.status(204).end();
  }

  // ❌ Method không hỗ trợ
  return res.status(405).json({ error: 'Method not allowed' });
}
