const https = require('https')

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    try {
      https.get(url, (resp) => {
        let data = ''
        resp.on('data', (chunk) => { data += chunk })
        resp.on('end', () => { try { resolve(JSON.parse(data)) } catch (e) { reject(e) } })
      }).on('error', reject)
    } catch (e) { reject(e) }
  })
}

module.exports = async function(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', '*')
    return res.status(200).end()
  }
  const key = process.env.AMAP_KEY || process.env.VITE_AMAP_KEY
  const { keywords = '', offset = '8' } = req.query || {}
  if (!key) return res.status(500).json({ status: 0, info: 'Missing AMAP_KEY' })
  const url = `https://restapi.amap.com/v3/place/text?key=${encodeURIComponent(key)}&keywords=${encodeURIComponent(keywords)}&citylimit=false&offset=${encodeURIComponent(offset)}&page=1&extensions=base`
  try {
    const data = await fetchJson(url)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.status(200).json(data)
  } catch (e) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.status(500).json({ status: 0, info: 'amap proxy error', error: String(e) })
  }
}

