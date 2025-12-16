import { useEffect, useMemo, useState } from 'react'
import { loadTypeTree, toTwoLevels } from '../types'

export function useTypes() {
  const [typeTree, setTypeTree] = useState<{ lv1: any[]; children: Record<string, any[]> }>({ lv1: [], children: {} })
  const [checkedKeys, setCheckedKeys] = useState<string[]>(['060000'])
  useEffect(() => { (async () => { const tree = await loadTypeTree(); setTypeTree(toTwoLevels(tree)) })() }, [])
  const typeOptions = useMemo(() => (typeTree.lv1 || []).map(lv1 => ({ value: lv1.code, label: lv1.name || lv1.code })), [typeTree])
  return { typeOptions, checkedKeys, setCheckedKeys, typeTree }
}

