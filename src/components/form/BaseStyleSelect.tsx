import React from 'react'
import { Select } from 'antd'

type StyleType = 'osm' | 'carto-light' | 'carto-dark'

export default function BaseStyleSelect({ style, setStyle }:{ style: StyleType; setStyle: (v: StyleType) => void }){
  return (
    <div className="field" style={{ width: 140 }}>
      <div className="field-label">底图</div>
      <Select value={style} onChange={(v) => setStyle(v as StyleType)} style={{ width: '100%' }} options={[{ value: 'osm', label: 'OSM 标准' }, { value: 'carto-light', label: 'Carto Light' }, { value: 'carto-dark', label: 'Carto Dark' }]} />
    </div>
  )
}
