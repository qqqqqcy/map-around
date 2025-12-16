import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { amapText, amapAround, amapTips } from '../api'
import { distanceMeters, choosePaging } from '../utils/geo'
import { toWgsLatLng, wgsToGcj, isWgsBase } from '../utils/coords'
import { svgIcon } from '../utils/icons'
import { loadTypeTree, toTwoLevels } from '../types'
import { colorForTopCode } from '../utils/colors'

export function useSearch(mapRef: any, markerLayerRef: any) {
  const [suggestOptions, setSuggestOptions] = useState<{ value: string; label: string; lat: number; lon: number }[]>([])
  const [suggestLoading, setSuggestLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [count, setCount] = useState(0)
  const [searchLoading, setSearchLoading] = useState(false)
  const lv1NameToCodeRef = useRef<Record<string, string>>({})

  async function ensureTypeMap() {
    if (Object.keys(lv1NameToCodeRef.current).length > 0) return
    const tree = await loadTypeTree()
    const two = toTwoLevels(tree)
    const m: Record<string, string> = {}
    for (const n of two.lv1) { m[String(n.name || '')] = String(n.code) }
    lv1NameToCodeRef.current = m
  }

  async function fetchSuggest(backendBase: string, q: string, style: string) {
    if (!q.trim() || q.trim().length < 2) { setSuggestOptions([]); return }
    setSuggestLoading(true)
    try {
      const center = mapRef.current?.getCenter?.()
      let loc: { lat: number; lon: number } | undefined = undefined
      if (center) {
        if (isWgsBase(style)) { const [lngG, latG] = wgsToGcj(center.lng, center.lat); loc = { lat: latG, lon: lngG } }
        else { loc = { lat: center.lat, lon: center.lng } }
      }
      const tips = await amapTips(backendBase, q, loc)
      const opts = (tips.tips || []).map((t: any) => { const [lng, lat] = String(t.location || '').split(',').map(Number); return { value: String(t.name || q), label: String(t.name || q), lat, lon: lng } }).filter((i: any) => isFinite(i.lat) && isFinite(i.lon))
      setSuggestOptions(opts)
    } finally { setSuggestLoading(false) }
  }
  const searchTimerRef = useRef<number | null>(null)
  function onSearchDebounced(backendBase: string, q: string, style: string) {
    if (searchTimerRef.current) window.clearTimeout(searchTimerRef.current)
    searchTimerRef.current = window.setTimeout(() => { fetchSuggest(backendBase, q, style) }, 500)
  }
  useEffect(() => () => { if (searchTimerRef.current) window.clearTimeout(searchTimerRef.current) }, [])

  async function runSearch(backendBase: string, place: string, diameter: number, checkedKeys: string[], style: string) {
    if (!place.trim()) return
    await ensureTypeMap()
    const markerLayer = markerLayerRef.current!
    markerLayer.clearLayers()
    setSearchLoading(true)
    try {
      let centerPt: [number, number]
      let lonApi: number, latApi: number
      const data = await amapText(backendBase, place)
      const p = (data.pois || [])[0]
      if (!p) return
      const loc = String(p.location || '').split(',').map(Number)
      const lng = loc[0], lat = loc[1]
      centerPt = isWgsBase(style) ? toWgsLatLng(lng, lat) : [lat, lng]
      lonApi = lng; latApi = lat
      mapRef.current!.setView(centerPt, 14)
      const centerMarker = L.marker(centerPt, { icon: svgIcon('#1976d2', 0.5) }).addTo(markerLayer)
      centerMarker.bindPopup(String(p.name || place))
      const searchRadius = Math.max(0, diameter / 2)
      L.circle(centerPt, { radius: searchRadius, color: '#1976d2', weight: 1.5, fillColor: '#90caf9', fillOpacity: 0.2 }).addTo(markerLayer)
      const { offset } = choosePaging(searchRadius)
      const useRadius = searchRadius > 50000 ? 5000 : searchRadius
      const typesParam = (checkedKeys.length ? checkedKeys : ['060000']).join('|')
      let page = 1, total = 0, boundaryReached = false
      const seen = new Set<string>()
      const out: any[] = []
      let drawn = 0
      while (!boundaryReached && page < 50) {
        const around = await amapAround(backendBase, { location: `${lonApi},${latApi}`, radius: String(useRadius), types: typesParam, output: 'json', sortrule: 'distance', offset: String(offset), page: String(page) })
        const pois = around.pois || []
        let inPageWithin = 0, lastDist = NaN
        for (const poi of pois) {
          const loc = poi.location ? poi.location.split(',').map(Number) : null
          if (!loc) continue
          let pos: [number, number] = [loc[1], loc[0]]
          if (isWgsBase(style)) pos = toWgsLatLng(loc[0], loc[1])
          const dist = distanceMeters(centerPt, pos)
          lastDist = dist
          if (dist > searchRadius) continue
          inPageWithin++
          const sig = `${poi.name}|${poi.location}`
          if (seen.has(sig)) continue
          seen.add(sig)
          const typeStr = String(poi.type || '')
          let topCode = '060000'
          for (const [nm, code] of Object.entries(lv1NameToCodeRef.current)) { if (nm && typeStr.includes(nm)) { topCode = code; break } }
          out.push({ name: String(poi.name || ''), pos, dist, address: String(poi.address || ''), type: typeStr, topCode, adname: String(poi.adname || ''), sig })
          if (drawn < 500) {
            const m = L.marker(pos, { icon: svgIcon(colorForTopCode(topCode), 1) }).addTo(markerLayer)
            m.bindPopup(String(poi.name || ''))
            drawn++
          }
          total++
        }
        if (pois.length === 0) break
        if (isFinite(lastDist) && lastDist > searchRadius) { boundaryReached = true; break }
        page++
        // incremental update
        const outSorted = out.slice().sort((a, b) => a.dist - b.dist)
        setResults(outSorted)
        setCount(total)
        await new Promise(r => setTimeout(r, 1000))
      }
      out.sort((a, b) => a.dist - b.dist)
      setResults(out)
      setCount(total)
    } finally { setSearchLoading(false) }
  }

  return { suggestOptions, suggestLoading, onSearchDebounced, runSearch, results, count, searchLoading }
}
