export type TypeNode = { code: string; name: string; children?: Record<string, TypeNode> }
export type TypeTree = Record<string, TypeNode>

export async function loadTypeTree(): Promise<TypeTree> {
  try {
    const r = await fetch('/assets/types.json')
    if (!r.ok) throw new Error('no types.json')
    return await r.json()
  } catch (e) {
    return {}
  }
}

export function toTwoLevels(tree: TypeTree): { lv1: TypeNode[]; children: Record<string, TypeNode[]> } {
  const lv1 = Object.values(tree)
  const children: Record<string, TypeNode[]> = {}
  for (const n of lv1) {
    children[n.code] = Object.values(n.children || {})
  }
  return { lv1, children }
}

