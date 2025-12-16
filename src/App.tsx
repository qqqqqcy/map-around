import React, { useState } from 'react'
import Legend from './components/Legend'
import SideList from './components/SideList'
import { useMap } from './hooks/useMap'
import { useTypes } from './hooks/useTypes'
import { useSearch } from './hooks/useSearch'
import { detectBackendBase } from './api'
import { colorForTopCode } from './utils/colors'
import PlaceField from './components/form/PlaceField'
import BaseStyleSelect from './components/form/BaseStyleSelect'
import DiameterInput from './components/form/DiameterInput'
import TypeSelect from './components/form/TypeSelect'
import ActionBar from './components/form/ActionBar'

export default function App() {
  const [backendBase] = useState(detectBackendBase())
  const [place, setPlace] = useState('')
  const [diameter, setDiameter] = useState<number>(1000)
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [legendVisible, setLegendVisible] = useState(true)
  const { mapRef, markerLayerRef, style, setStyle } = useMap()
  const { typeOptions, checkedKeys, setCheckedKeys } = useTypes()
  const { suggestOptions, suggestLoading, onSearchDebounced, runSearch, results, count, searchLoading } = useSearch(mapRef, markerLayerRef)

  function nameForTopCode(code: string) { const n = (typeOptions || []).find((x: any) => x.value === code); return n ? (n.label || code) : code }

  return (
    <div id="app">
      <div className="toolbar" style={{ display: 'grid', gridTemplateColumns: 'auto auto auto auto auto', gap: 8, alignItems: 'center' }}>
        <PlaceField place={place} setPlace={setPlace} suggestOptions={suggestOptions} suggestLoading={suggestLoading} onSearchDebounced={onSearchDebounced} backendBase={backendBase} style={style} mapRef={mapRef} markerLayerRef={markerLayerRef} diameter={diameter} />
        <BaseStyleSelect style={style} setStyle={setStyle} />
        <DiameterInput diameter={diameter} setDiameter={setDiameter} />
        <TypeSelect typeOptions={typeOptions} checkedKeys={checkedKeys} setCheckedKeys={setCheckedKeys} />
        <ActionBar runSearch={runSearch} backendBase={backendBase} place={place} diameter={diameter} checkedKeys={checkedKeys} style={style} searchLoading={searchLoading} count={count} />
      </div>
      <div id="map"></div>
      <Legend visible={legendVisible} onHide={() => setLegendVisible(false)} onShow={() => setLegendVisible(true)} checkedCodes={checkedKeys} colorForTopCode={colorForTopCode} nameForTopCode={nameForTopCode} />
      <SideList visible={sidebarVisible} onShow={() => setSidebarVisible(true)} onHide={() => setSidebarVisible(false)} results={results} mapRef={mapRef} />
    </div>
  )
}
