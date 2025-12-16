import fs from 'node:fs'
import path from 'node:path'
import xlsx from 'xlsx'

function buildTree(rows) {
  const lv1 = {}
  const lv2 = {}
  for (const [code0, name0] of rows) {
    const code = String(code0 || '').trim()
    const name = String(name0 || '').trim()
    if (!/^\d{6}$/.test(code)) continue
    if (code.slice(2) === '0000') {
      lv1[code] = { code, name, children: {} }
    } else if (code.slice(4) === '00') {
      const p = code.slice(0, 2) + '0000'
      if (!lv1[p]) lv1[p] = { code: p, name: '', children: {} }
      lv1[p].children[code] = { code, name, children: {} }
      lv2[code] = lv1[p].children[code]
    } else {
      const p = code.slice(0, 4) + '00'
      let node = lv2[p]
      if (!node) {
        const p1 = code.slice(0, 2) + '0000'
        if (!lv1[p1]) lv1[p1] = { code: p1, name: '', children: {} }
        if (!lv1[p1].children[p]) lv1[p1].children[p] = { code: p, name: '', children: {} }
        node = lv1[p1].children[p]
        lv2[p] = node
      }
      node.children[code] = { code, name }
    }
  }
  return lv1
}

function pickName(vals, codeIdx) {
  let best = ''
  const score = (s) => Array.from(s).reduce((acc, ch) => acc + (ch >= '\u4e00' && ch <= '\u9fff' ? 1 : 0), 0)
  for (let i = 0; i < vals.length; i++) {
    if (i === codeIdx) continue
    const v = vals[i]
    if (!v) continue
    if (/^\d+$/.test(v)) continue
    if (v === '代码' || v === '名称') continue
    if (score(v) > score(best)) best = v
  }
  return best
}

function main() {
  const [excelPath, outPath] = process.argv.slice(2)
  if (!excelPath || !outPath) {
    console.error('Usage: node scripts/excel_to_types_json.js <excel_path> <output_json_path>')
    process.exit(2)
  }
  const wb = xlsx.readFile(excelPath)
  const rows = []
  const six = /^\d{6}$/
  for (const sheetName of wb.SheetNames) {
    const ws = wb.Sheets[sheetName]
    const json = xlsx.utils.sheet_to_json(ws, { header: 1 })
    for (const row of json) {
      const vals = row.map((v) => (v == null ? '' : String(v).trim()))
      let idx = -1
      for (let i = 0; i < vals.length; i++) { if (six.test(vals[i])) { idx = i; break } }
      if (idx === -1) continue
      const code = vals[idx]
      const name = pickName(vals, idx)
      rows.push([code, name])
    }
  }
  const tree = buildTree(rows)
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, JSON.stringify(tree, null, 2), 'utf-8')
  console.log(`Wrote ${outPath} with ${Object.keys(tree).length} top-level categories`)
}

main()

