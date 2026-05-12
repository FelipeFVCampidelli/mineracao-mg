import SwiftUI
import MapKit

// MARK: - MapKitView

struct MapKitView: UIViewRepresentable {

    @ObservedObject var appData: AppData
    var onRegionTapped: (String) -> Void

    // MG center & span
    private static let mgCenter   = CLLocationCoordinate2D(latitude: -18.3, longitude: -44.6)
    private static let mgSpan     = MKCoordinateSpan(latitudeDelta: 9.2, longitudeDelta: 11.8)
    private static let mgRegion   = MKCoordinateRegion(center: mgCenter, span: mgSpan)

    // MARK: UIViewRepresentable

    func makeUIView(context: Context) -> MKMapView {
        let map = MKMapView()
        map.mapType = .satellite
        map.isScrollEnabled   = false
        map.isZoomEnabled     = false
        map.isRotateEnabled   = false
        map.isPitchEnabled    = false
        map.showsUserLocation = false
        map.showsCompass      = false
        map.showsScale        = false
        map.delegate          = context.coordinator
        map.setRegion(Self.mgRegion, animated: false)

        let tap = UITapGestureRecognizer(target: context.coordinator,
                                         action: #selector(Coordinator.handleTap(_:)))
        map.addGestureRecognizer(tap)
        return map
    }

    func updateUIView(_ map: MKMapView, context: Context) {
        guard appData.mapReady else { return }

        let existingTitles = Set(map.overlays.compactMap { $0.title ?? nil })
        let newTitles: Set<String> = {
            var t = Set(appData.regionPolygons.keys)
            if appData.maskPolygon != nil { t.insert("mask") }
            return t
        }()

        // Rebuild overlays if data changed
        if existingTitles != newTitles {
            map.removeOverlays(map.overlays)
            context.coordinator.regionRenderers.removeAll()

            // Mask first at lower level (darkens everything outside MG)
            if let mask = appData.maskPolygon {
                map.addOverlay(mask, level: .aboveRoads)
            }

            // Region fills on top (always visible above the mask)
            for polygons in appData.regionPolygons.values {
                map.addOverlays(polygons, level: .aboveLabels)
            }
        }

        // Update highlight styling on existing renderers (cheap, no overlay rebuild)
        let highlighted = appData.highlightedRegionId
        let hasHighlight = highlighted != nil
        for (regionId, renderers) in context.coordinator.regionRenderers {
            guard let region = Region.find(regionId) else { continue }
            let isTarget = regionId == highlighted
            let alpha: CGFloat = hasHighlight ? (isTarget ? 0.9 : 0.2) : 0.65
            let strokeAlpha: CGFloat = hasHighlight ? (isTarget ? 0.9 : 0.08) : 0.25
            let lineWidth: CGFloat = isTarget ? 2.0 : 0.8
            for renderer in renderers {
                renderer.fillColor   = region.uiColor.withAlphaComponent(alpha)
                renderer.strokeColor = isTarget
                    ? UIColor.white.withAlphaComponent(strokeAlpha)
                    : UIColor.white.withAlphaComponent(strokeAlpha)
                renderer.lineWidth   = lineWidth
                renderer.setNeedsDisplay()
            }
        }
    }

    func makeCoordinator() -> Coordinator { Coordinator(self) }

    // MARK: - EvenOddMaskRenderer
    // MKPolygonRenderer uses the non-zero winding rule by default. Because GeoJSON exterior
    // rings and our world-rectangle have the same winding direction, the interior MG polygon
    // adds rather than subtracts, making the mask fill MG instead of leaving a hole.
    // We build the CGPath manually from the polygon's exterior + interior coordinates
    // and fill with the even-odd rule so MG becomes a transparent hole.
    class EvenOddMaskRenderer: MKPolygonRenderer {
        override func draw(_ mapRect: MKMapRect, zoomScale: MKZoomScale, in context: CGContext) {
            let poly = self.polygon
            guard poly.pointCount > 0 else { return }

            let compositePath = CGMutablePath()

            // Exterior ring (world rectangle)
            let extPoints = poly.points()
            compositePath.move(to: point(for: extPoints[0]))
            for i in 1..<poly.pointCount {
                compositePath.addLine(to: point(for: extPoints[i]))
            }
            compositePath.closeSubpath()

            // Interior rings (MG boundary = hole)
            if let interiors = poly.interiorPolygons {
                for interior in interiors {
                    guard interior.pointCount > 0 else { continue }
                    let intPoints = interior.points()
                    compositePath.move(to: point(for: intPoints[0]))
                    for i in 1..<interior.pointCount {
                        compositePath.addLine(to: point(for: intPoints[i]))
                    }
                    compositePath.closeSubpath()
                }
            }

            context.saveGState()
            context.addPath(compositePath)
            if let color = fillColor {
                context.setFillColor(color.cgColor)
                context.fillPath(using: .evenOdd)
            }
            context.restoreGState()
        }
    }

    // MARK: Coordinator

    class Coordinator: NSObject, MKMapViewDelegate {

        var parent: MapKitView
        /// Cached renderers per region so we can update fill/stroke without rebuilding overlays.
        var regionRenderers: [String: [MKPolygonRenderer]] = [:]

        init(_ parent: MapKitView) { self.parent = parent }

        // MARK: Renderer

        func mapView(_ map: MKMapView, rendererFor overlay: MKOverlay) -> MKOverlayRenderer {
            guard let polygon = overlay as? MKPolygon else {
                return MKOverlayRenderer(overlay: overlay)
            }

            if polygon.title == "mask" {
                let renderer = EvenOddMaskRenderer(polygon: polygon)
                renderer.fillColor   = UIColor(red: 0.07, green: 0.07, blue: 0.07, alpha: 1)
                renderer.strokeColor = .clear
                renderer.lineWidth   = 0
                return renderer
            } else if let id = polygon.title, let region = Region.find(id) {
                let renderer = MKPolygonRenderer(polygon: polygon)
                renderer.fillColor   = region.uiColor.withAlphaComponent(0.65)
                renderer.strokeColor = UIColor.white.withAlphaComponent(0.25)
                renderer.lineWidth   = 0.8
                // Cache for later highlight updates
                regionRenderers[id, default: []].append(renderer)
                return renderer
            }
            return MKOverlayRenderer(overlay: overlay)
        }

        // MARK: Tap detection

        @objc func handleTap(_ gesture: UITapGestureRecognizer) {
            guard let map = gesture.view as? MKMapView else { return }
            let point      = gesture.location(in: map)
            let coordinate = map.convert(point, toCoordinateFrom: map)

            for overlay in map.overlays {
                guard let polygon = overlay as? MKPolygon,
                      let id = polygon.title, id != "mask" else { continue }
                guard let renderer = map.renderer(for: overlay) as? MKPolygonRenderer else { continue }
                let mapPoint      = MKMapPoint(coordinate)
                let rendererPoint = renderer.point(for: mapPoint)
                if renderer.path?.contains(rendererPoint) == true {
                    parent.onRegionTapped(id)
                    return
                }
            }
        }
    }
}
