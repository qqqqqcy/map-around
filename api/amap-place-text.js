export default async function(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', '*')
    return res.status(200).end()
  }
  const key = process.env.AMAP_KEY || process.env.VITE_AMAP_KEY
  const { keywords = '', offset = '8' } = req.query || {}
  if (!key) return res.status(500).json({ status: 0, info: 'Missing AMAP_KEY' })
  const params = new URLSearchParams({ key, keywords, citylimit: 'false', offset, page: '1', extensions: 'base' })
  const url = `https://restapi.amap.com/v3/place/text?${params.toString()}`
  try {
    const r = await fetch(url)
    const data = await r.json()
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.status(200).json(data)
  } catch (e) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.status(500).json({ status: 0, info: 'amap proxy error', error: String(e) })
  }
}

