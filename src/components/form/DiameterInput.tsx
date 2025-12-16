import React from 'react'
import { InputNumber } from 'antd'

export default function DiameterInput({ diameter, setDiameter }:{ diameter: number; setDiameter: (n: number) => void }){
  return (
    <div className="field" style={{ width: 120 }}>
      <div className="field-label">直径（米）</div>
      <InputNumber value={diameter} min={100} step={100} onChange={(v) => setDiameter(Number(v) || 1000)} style={{ width: '100%' }} />
    </div>
  )
}

