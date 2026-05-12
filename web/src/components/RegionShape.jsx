import React, { useMemo } from 'react'

function featuresToSVGPaths(features, svgW, svgH, padding = 12) {
  if (!features?.length) return []

  const allCoords = []
  features.forEach(f => {
    const geom = f.geometry
    const rings = geom.type === 'Polygon'
      ? geom.coordinates
      : geom.type === 'MultiPolygon'
        ? geom.coordinates.flat()
        : []
    rings.forEach(ring => ring.forEach(([lon, lat]) => allCoords.push([lon, lat])))
  })

  if (!allCoords.length) return []

  const lons = allCoords.map(c => c[0])
  const lats = allCoords.map(c => c[1])
  const minLon = Math.min(...lons), maxLon = Math.max(...lons)
  const minLat = Math.min(...lats), maxLat = Math.max(...lats)
  const lonRange = maxLon - minLon || 1
  const latRange = maxLat - minLat || 1

  // Manter aspect ratio
  const scale = Math.min(
    (svgW - padding * 2) / lonRange,
    (svgH - padding * 2) / latRange
  )
  const offsetX = (svgW - lonRange * scale) / 2
  const offsetY = (svgH - latRange * scale) / 2

  const project = ([lon, lat]) => [
    offsetX + (lon - minLon) * scale,
    svgH - offsetY - (lat - minLat) * scale, // Y invertido
  ]

  const paths = []
  features.forEach((f, fi) => {
    const geom = f.geometry
    const polys = geom.type === 'Polygon'
      ? [geom.coordinates]
      : geom.type === 'MultiPolygon'
        ? geom.coordinates
        : []
    polys.forEach((poly, pi) => {
      poly.forEach((ring, ri) => {
        const d = ring.map((coord, i) => {
          const [x, y] = project(coord)
          return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
        }).join(' ') + ' Z'
        paths.push(<path key={`${fi}-${pi}-${ri}`} d={d} />)
      })
    })
  })

  return paths
}

export default function RegionShape({ features, color, width = 220, height = 180 }) {
  const paths = useMemo(
    () => featuresToSVGPaths(features, width, height),
    [features, width, height]
  )

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: 'block', overflow: 'visible' }}
    >
      <g fill={color} fillOpacity={0.85} stroke="rgba(255,255,255,0.3)" strokeWidth={0.8}>
        {paths}
      </g>
    </svg>
  )
}