import L from 'leaflet'

export function svgIcon(color: string, offsetRatio = 1) {
  const size = 28
  const html = `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="${color}" opacity="0.85"/>
      <circle cx="12" cy="12" r="4" fill="#fff"/>
    </svg>`
  return L.divIcon({ className: 'poi-icon', html, iconSize: [size, size], iconAnchor: [size / 2, size * offsetRatio] })
}

