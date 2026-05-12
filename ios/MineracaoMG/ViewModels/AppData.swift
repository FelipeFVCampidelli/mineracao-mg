import Foundation
import MapKit
import Combine

@MainActor
final class AppData: ObservableObject {

    // MARK: Published state

    @Published var minerals: [String: Mineral] = [:]
    @Published var regionMinerals: [String: [String]] = [:]          // regionId → [mineralId]
    @Published var regionPolygons: [String: [MKPolygon]] = [:]       // regionId → polygons
    @Published var maskPolygon: MKPolygon?                            // inverse mask
    @Published var mapReady = false

    @Published var locale: AppLocale = .pt
    @Published var selectedRegionId: String? = nil                    // drives bottom sheet
    @Published var highlightedRegionId: String? = nil                 // long-press highlight on map

    // MARK: Init

    init() {
        loadLocalData()
        Task { await loadGeoJSON() }
    }

    // MARK: Helpers

    func mineralsForRegion(_ regionId: String) -> [Mineral] {
        let ids = regionMinerals[regionId] ?? []
        return ids.compactMap { minerals[$0] }
    }

    // MARK: Private – local JSON

    private func loadLocalData() {
        minerals = DataService.shared.loadMinerals()
        regionMinerals = DataService.shared.loadRegionMinerals()
    }

    // MARK: Private – GeoJSON (network)

    private func loadGeoJSON() async {
        async let regionsTask = GeoJSONService.shared.fetchAllRegions()
        async let boundaryTask = GeoJSONService.shared.fetchStateBoundary()

        do {
            let (regions, boundary) = try await (regionsTask, boundaryTask)
            regionPolygons = regions
            maskPolygon = buildMask(from: boundary)
            mapReady = true
        } catch {
            print("[AppData] GeoJSON error:", error)
            // still show app without mask
            mapReady = true
        }
    }

    /// Creates an inverse mask: world rectangle with MG cut out.
    private func buildMask(from boundaryPolygons: [MKPolygon]) -> MKPolygon? {
        // Collect all exterior coords from the state boundary polygons to use as holes
        guard !boundaryPolygons.isEmpty else { return nil }

        var worldCoords: [CLLocationCoordinate2D] = [
            CLLocationCoordinate2D(latitude: -85,  longitude: -180),
            CLLocationCoordinate2D(latitude: -85,  longitude:  180),
            CLLocationCoordinate2D(latitude:  85,  longitude:  180),
            CLLocationCoordinate2D(latitude:  85,  longitude: -180),
        ]

        let mask = MKPolygon(coordinates: &worldCoords, count: worldCoords.count,
                             interiorPolygons: boundaryPolygons)
        mask.title = "mask"
        return mask
    }
}
