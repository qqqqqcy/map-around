import React from 'react'
import { Select } from 'antd'

export default function TypeSelect({ typeOptions, checkedKeys, setCheckedKeys }: { typeOptions: any[]; checkedKeys: string[]; setCheckedKeys: (vals: string[]) => void }) {
  return (
    <div className="field" style={{ width: 220 }}>
      <div className="field-label">类型（一级）</div>
      <Select
        mode="multiple"
        allowClear
        maxTagCount={1}
        value={checkedKeys}
        options={typeOptions}
        onChange={(vals) => setCheckedKeys(vals as string[])}
        placeholder="选择一级类型"
        style={{ width: '100%' }}
        listHeight={360}
        showSearch
        optionFilterProp="label"
      />
    </div>
  )
}

