export function detectBackendBase(): string {
  const params = new URLSearchParams(location.search)
  const backendParam = params.get('backend') || ''
  const envBase = (import.meta as any).env?.VITE_BACKEND_BASE || ''
  let base = (backendParam || envBase).replace(/\/$/, '')
  try {
    const host = String(location.hostname || '')
    const isLocal = host === 'localhost' || host.startsWith('127.') || host === '0.0.0.0'
    if (!base && host && !isLocal) base = location.origin
  } catch {}
  return base
}

function detectAmapKey(): string {
  const params = new URLSearchParams(location.search)
  const envKey = (import.meta as any).env?.VITE_AMAP_KEY || ''
  return params.get('amap_key') || envKey
}

const CACHE_TTL_MS = 5 * 60 * 1000
const respCache: Map<string, { ts: number; data: any }> = new Map()
const inflight: Map<string, Promise<any>> = new Map()

function sortedParams(obj: Record<string, string>): string {
  const entries = Object.entries(obj).filter(([, v]) => v != null)
  entries.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
  const p = new URLSearchParams()
  for (const [k, v] of entries) p.set(k, v)
  return p.toString()
}

async function fetchWithCache(url: string) {
  const hit = respCache.get(url)
  const now = Date.now()
  if (hit && now - hit.ts < CACHE_TTL_MS) return hit.data
  if (inflight.has(url)) return await inflight.get(url)!
  const p = (async () => {
    const r = await fetch(url)
    if (!r.ok) throw new Error('fetch failed')
    const json = await r.json()
    if (json && json.status === '0' && json.infocode === '10021') {
      if (hit) return hit.data
      throw new Error('CUQPS limit')
    }
    respCache.set(url, { ts: now, data: json })
    return json
  })()
  inflight.set(url, p)
  try { return await p } finally { inflight.delete(url) }
}

async function fetchNoCache(url: string) {
  const r = await fetch(url)
  if (!r.ok) throw new Error('fetch failed')
  const json = await r.json()
  if (json && json.status === '0' && json.infocode === '10021') throw new Error('CUQPS limit')
  return json
}

export async function amapText(backendBase: string, keywords: string) {
  const directKey = detectAmapKey()
  if (backendBase) {
    const url = `${backendBase}/api/amap-place-text?keywords=${encodeURIComponent(keywords)}`
    return fetchWithCache(url)
  }
  if (directKey) {
    const qs = sortedParams({ key: directKey, keywords, citylimit: 'false', offset: '8', page: '1', extensions: 'base' })
    const url = `https://restapi.amap.com/v3/place/text?${qs}`
    return fetchWithCache(url)
  }
  throw new Error('No backend or AMap key')
}

export async function amapAround(backendBase: string, paramsObj: Record<string, string>) {
  const directKey = detectAmapKey()
  const qs = sortedParams(paramsObj)
  if (backendBase) {
    const url = `${backendBase}/api/amap-place-around?${qs}`
    return fetchNoCache(url)
  }
  if (directKey) {
    const qs2 = sortedParams({ ...paramsObj, key: directKey, output: 'json' })
    const url = `https://restapi.amap.com/v3/place/around?${qs2}`
    return fetchNoCache(url)
  }
  throw new Error('No backend or AMap key')
}

export async function amapTips(backendBase: string, keywords: string, loc?: { lat: number; lon: number }) {
  const directKey = detectAmapKey()
  const location = loc ? `${loc.lon},${loc.lat}` : ''
  if (backendBase) {
    const qs = sortedParams(location ? { keywords, citylimit: 'false', location } : { keywords, citylimit: 'false' })
    const url = `${backendBase}/api/amap-input-tips?${qs}`
    return fetchWithCache(url)
  }
  if (directKey) {
    const qs = sortedParams(location ? { key: directKey, keywords, citylimit: 'false', location } : { key: directKey, keywords, citylimit: 'false' })
    const url = `https://restapi.amap.com/v3/assistant/inputtips?${qs}`
    return fetchWithCache(url)
  }
  throw new Error('No backend or AMap key')
}
