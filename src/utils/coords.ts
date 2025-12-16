import { gcj02towgs84, wgs84togcj02 } from 'coordtransform'

export function toWgsLatLng(lng: number, lat: number): [number, number] {
  const [lngW, latW] = gcj02towgs84(lng, lat)
  return [latW, lngW]
}

export function wgsToGcj(lng: number, lat: number): [number, number] {
  return wgs84togcj02(lng, lat)
}

export function isWgsBase(style: string): boolean {
  return style === 'osm' || String(style).startsWith('carto')
}

