import React from 'react'
import { FloatButton, Button } from 'antd'

export default function SideList({ visible, onShow, onHide, results, mapRef }:{
  visible: boolean
  onShow: () => void
  onHide: () => void
  results: any[]
  mapRef: any
}){
  if (!visible) {
    if (results.length === 0) return null
    return <FloatButton description="显示列表" onClick={onShow} style={{ top: 96, right: 12, left: 'auto', bottom: 'auto' }} />
  }
  return (
    <div className="side right">
      <div className="side-header">
        <div>列表</div>
        <Button size="small" type="text" onClick={onHide}>隐藏</Button>
      </div>
      {results.map((r: any, idx) => (
        <div key={`${r.sig}-${idx}`} className="poi-item" onClick={() => { mapRef.current?.setView(r.pos, 16) }}>
          <div className="poi-item-header">
            <div className="poi-item-title">{r.name}</div>
          </div>
          <div className="poi-item-meta">{r.type || '未知类型'} · {Math.round(r.dist)}m · {r.adname || ''}</div>
          <div className="poi-item-addr">{r.address || ''}</div>
          <div className="poi-item-details">
            {(r.tel || r.rating) && (
              <div className="poi-item-extra">{r.tel ? `电话：${r.tel}` : ''}{r.tel && r.rating ? ' · ' : ''}{r.rating ? `评分：${r.rating}` : ''}</div>
            )}
            {Array.isArray(r.photos) && r.photos.length > 0 && (
              <div className="poi-photos">
                {r.photos.slice(0, 3).map((url: string, i: number) => (
                  <img key={i} className="poi-photo" src={url} alt="poi" onClick={(e) => { e.stopPropagation(); mapRef.current?.setView(r.pos, 17); }} />
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
