import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'

export function useMap() {
  const [style, setStyle] = useState<'osm' | 'carto-light' | 'carto-dark'>('osm')
  const mapRef = useRef<any>(null)
  const markerLayerRef = useRef<any>(null)
  useEffect(() => {
    const map = L.map('map', { center: [39.9042, 116.4074], zoom: 13 })
    mapRef.current = map
    markerLayerRef.current = L.layerGroup().addTo(map)
    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: 'OSM' })
    const cartoLight = L.tileLayer('https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png')
    const cartoDark = L.tileLayer('https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png')
    const base: Record<string, any> = { 'osm': osm, 'carto-light': cartoLight, 'carto-dark': cartoDark }
    base['osm'].addTo(map)
    ;(map as any)._base = base
    ;(map as any)._current = base['osm']
    return () => { map.remove() }
  }, [])
  useEffect(() => {
    const map: any = mapRef.current
    if (!map || !map._base) return
    const next = map._base[style]
    if (!next) return
    if (map._current) map.removeLayer(map._current)
    next.addTo(map)
    map._current = next
  }, [style])
  return { mapRef, markerLayerRef, style, setStyle }
}

