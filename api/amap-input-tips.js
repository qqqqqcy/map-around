module.exports = async function(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    return res.status(200).end();
  }
  try {
    const key = process.env.AMAP_KEY;
    if (!key) return res.status(500).json({ status: 0, info: 'Missing AMAP_KEY' });
    const { keywords = '', location = '', citylimit = 'false' } = req.query || {};
    const params = new URLSearchParams({ key, keywords, citylimit });
    if (location) params.set('location', String(location));
    const url = `https://restapi.amap.com/v3/assistant/inputtips?${params.toString()}`;
    const r = await fetch(url);
    const data = await r.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (e) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({ status: 0, info: 'inputtips error' });
  }
}

