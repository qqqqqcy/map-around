module.exports = async function(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    return res.status(200).end();
  }
  const key = process.env.AMAP_KEY;
  const { location = '', radius = '1000', types = '', offset = '50', page = '1', sortrule = 'distance' } = req.query || {};
  if (!key) return res.status(500).json({ status: 0, info: 'Missing AMAP_KEY' });
  const params = new URLSearchParams({
    key,
    location,
    radius,
    types,
    output: 'json',
    offset,
    page,
    sortrule
  });
  const url = `https://restapi.amap.com/v3/place/around?${params.toString()}`;
  try {
    const _fetch = globalThis.fetch ? globalThis.fetch : (await import('node-fetch')).default;
    const r = await _fetch(url);
    const data = await r.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (e) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({ status: 0, info: 'amap proxy error', error: String(e) });
  }
}
