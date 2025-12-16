import React from 'react'
import L from 'leaflet'
import { AutoComplete } from 'antd'
import { toWgsLatLng, isWgsBase } from '../../utils/coords'
import { svgIcon } from '../../utils/icons'

export default function PlaceField({
  place,
  setPlace,
  suggestOptions,
  suggestLoading,
  onSearchDebounced,
  backendBase,
  style,
  mapRef,
  markerLayerRef,
  diameter
}:{
  place: string
  setPlace: (v: string) => void
  suggestOptions: { value: string; label: string; lat: number; lon: number }[]
  suggestLoading: boolean
  onSearchDebounced: (backendBase: string, q: string, style: string) => void
  backendBase: string
  style: string
  mapRef: any
  markerLayerRef: any
  diameter: number
}){
  return (
    <div className="field" style={{ width: 420 }}>
      <div className="field-label">地点</div>
      <div className={suggestLoading ? 'input-wrap loading' : 'input-wrap'}>
        <AutoComplete
          value={place}
          options={suggestOptions}
          onSearch={(q) => onSearchDebounced(backendBase, q, style)}
          onChange={(v) => setPlace(v)}
          onSelect={(v) => {
            const item = suggestOptions.find((o: any) => String(o.value) === String(v))
            setPlace(String(v))
            if (item && isFinite(item.lat) && isFinite(item.lon)) {
              const fixed = isWgsBase(style) ? toWgsLatLng(item.lon, item.lat) : [item.lat, item.lon]
              mapRef.current?.setView(fixed as [number, number], 14)
              const markerLayer = markerLayerRef.current
              if (markerLayer) {
                markerLayer.clearLayers()
                const centerMarker = L.marker(fixed as [number, number], { icon: svgIcon('#1976d2', 0.5) }).addTo(markerLayer)
                centerMarker.bindPopup(String(v)).openPopup()
                L.circle(fixed as [number, number], { radius: Math.max(0, diameter / 2), color: '#1976d2', weight: 1.5, fillColor: '#90caf9', fillOpacity: 0.2 }).addTo(markerLayer)
              }
            }
          }}
          placeholder="输入地点，如 北京 紫金数码园 4号楼"
          style={{ width: '100%' }}
          popupClassName="top-overlay"
        />
      </div>
    </div>
  )
}

