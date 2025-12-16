module.exports = async function(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    return res.status(200).end();
  }
  const ak = process.env.BAIDU_AK;
  const { query = '', region = '', location = '', radius = '', page_size = '8' } = req.query || {};
  if (!ak) return res.status(500).json({ status: -1, message: 'Missing BAIDU_AK' });
  const params = new URLSearchParams({ query, output: 'json', scope: '2', ak, page_size });
  if (region) params.set('region', region);
  if (location) params.set('location', location);
  if (radius) params.set('radius', radius);
  const url = `https://api.map.baidu.com/place/v2/search?${params.toString()}`;
  try {
    const r = await fetch(url);
    const data = await r.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (e) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({ status: -1, message: 'baidu proxy error', error: String(e) });
  }
}
