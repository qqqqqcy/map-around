import React from 'react'
import { FloatButton, Button } from 'antd'

export default function Legend({ visible, onHide, onShow, checkedCodes, colorForTopCode, nameForTopCode }:{
  visible: boolean
  onHide: () => void
  onShow: () => void
  checkedCodes: string[]
  colorForTopCode: (code: string) => string
  nameForTopCode: (code: string) => string
}){
  if (visible) {
    return (
      <div className="legend-left">
        <div className="legend-header">
          <div>图示</div>
          <Button size="small" type="text" onClick={onHide}>隐藏</Button>
        </div>
        {(checkedCodes.length ? checkedCodes : ['060000']).map(code => (
          <div key={code} className="legend-item">
            <span className="legend-swatch" style={{ background: colorForTopCode(String(code)) }}></span>
            <span>{nameForTopCode(String(code))}</span>
          </div>
        ))}
      </div>
    )
  }
  return <FloatButton description="显示图示" onClick={onShow} style={{ left: 12, bottom: 12, right: 'auto' }} />
}

