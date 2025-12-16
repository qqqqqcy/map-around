export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }
  const key = process.env.AMAP_KEY;
  const { keywords = '', offset = '8' } = req.query || {};
  if (!key) return res.status(500).json({ status: 0, info: 'Missing AMAP_KEY' });
  const url = `https://restapi.amap.com/v3/place/text?key=${encodeURIComponent(key)}&keywords=${encodeURIComponent(keywords)}&citylimit=false&offset=${encodeURIComponent(offset)}&page=1&extensions=base`;
  try {
    const r = await fetch(url);
    const data = await r.json();
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.status(200).json(data);
  } catch (e) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.status(500).json({ status: 0, info: 'amap proxy error', error: String(e) });
  }
}

