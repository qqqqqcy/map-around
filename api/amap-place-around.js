module.exports = async function(req, res) {
  const origin = req.headers.origin || '*';
  const allowed = process.env.ALLOWED_ORIGIN;
  const allowOrigin = allowed ? (origin === allowed ? origin : allowed) : origin;
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', allowOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }
  const key = process.env.AMAP_KEY;
  const { location = '', radius = '1000', types = '' } = req.query || {};
  if (!key) return res.status(500).json({ status: 0, info: 'Missing AMAP_KEY' });
  const url = `https://restapi.amap.com/v3/place/around?key=${encodeURIComponent(key)}&location=${encodeURIComponent(location)}&radius=${encodeURIComponent(radius)}&types=${types}&output=json`;
  try {
    const r = await fetch(url);
    const data = await r.json();
    res.setHeader('Access-Control-Allow-Origin', allowOrigin);
    res.status(200).json(data);
  } catch (e) {
    res.setHeader('Access-Control-Allow-Origin', allowOrigin);
    res.status(500).json({ status: 0, info: 'amap proxy error', error: String(e) });
  }
}
