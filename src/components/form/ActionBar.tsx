import React from 'react'
import { Space, Button } from 'antd'

export default function ActionBar({ runSearch, backendBase, place, diameter, checkedKeys, style, searchLoading, count }: {
  runSearch: (backendBase: string, place: string, diameter: number, checkedKeys: string[], style: string) => void
  backendBase: string
  place: string
  diameter: number
  checkedKeys: string[]
  style: string
  searchLoading: boolean
  count: number
}) {
  return (
    <Space>
      <div className="field">
        <div className="field-label">操作</div>
        <Button type="primary" onClick={() => runSearch(backendBase, place, diameter, checkedKeys, style)} loading={searchLoading} disabled={searchLoading}>确定</Button>
      </div>
      <div className="field">
        <div className="field-label">统计</div>
        <span className="pill"> {count}</span>
      </div>
    </Space>
  )
}

