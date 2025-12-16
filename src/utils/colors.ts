export function colorForTopCode(code: string) {
  const palette = ['#d81b60', '#2962ff', '#2e7d32', '#f57c00', '#6d4c41', '#7b1fa2', '#00897b', '#c2185b', '#5d4037', '#512da8']
  if (!/^\d{6}$/.test(code)) return palette[0]
  const idx = parseInt(code.slice(0, 2), 10) % palette.length
  return palette[idx]
}
