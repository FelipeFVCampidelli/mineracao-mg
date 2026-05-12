import Foundation
import MapKit

// MARK: - GeoJSONService
// Fetches mesorregião GeoJSON from IBGE API v3 and converts to MKPolygon arrays.

final class GeoJSONService {

    static let shared = GeoJSONService()
    private init() {}

    // One polygon array per region ID
    typealias RegionPolygons = [String: [MKPolygon]]

    /// Fetches all 12 mesorregião polygons concurrently.
    func fetchAllRegions() async throws -> RegionPolygons {
        var result: RegionPolygons = [:]
        try await withThrowingTaskGroup(of: (String, [MKPolygon]).self) { group in
            for region in Region.all {
                group.addTask {
                    let polygons = try await self.fetchRegion(region)
                    return (region.id, polygons)
                }
            }
            for try await (id, polygons) in group {
                result[id] = polygons
            }
        }
        return result
    }

    /// Fetches the MG state boundary for building the mask polygon.
    func fetchStateBoundary() async throws -> [MKPolygon] {
        let url = URL(string: "https://servicodados.ibge.gov.br/api/v3/malhas/estados/31?formato=application/vnd.geo%2Bjson")!
        let (data, _) = try await URLSession.shared.data(from: url)
        return polygons(from: data, regionId: "boundary")
    }

    // MARK: Private

    private func fetchRegion(_ region: Region) async throws -> [MKPolygon] {
        let url = URL(string: "https://servicodados.ibge.gov.br/api/v3/malhas/mesorregioes/\(region.ibgeCode)?formato=application/vnd.geo%2Bjson")!
        let (data, _) = try await URLSession.shared.data(from: url)
        return polygons(from: data, regionId: region.id)
    }

    private func polygons(from data: Data, regionId: String) -> [MKPolygon] {
        guard let fc = try? JSONDecoder().decode(GeoJSONFeatureCollection.self, from: data) else {
            return []
        }
        var result: [MKPolygon] = []
        for feature in fc.features {
            switch feature.geometry {
            case .polygon(let rings):
                if let poly = mkPolygon(rings: rings, title: regionId) {
                    result.append(poly)
                }
            case .multiPolygon(let polys):
                for rings in polys {
                    if let poly = mkPolygon(rings: rings, title: regionId) {
                        result.append(poly)
                    }
                }
            }
        }
        return result
    }

    private func mkPolygon(rings: [[[Double]]], title: String) -> MKPolygon? {
        guard let exterior = rings.first, !exterior.isEmpty else { return nil }
        var outerCoords = exterior.compactMap { c -> CLLocationCoordinate2D? in
            guard c.count >= 2 else { return nil }
            return CLLocationCoordinate2D(latitude: c[1], longitude: c[0])
        }
        let interiors: [MKPolygon] = rings.dropFirst().compactMap { ring in
            var coords = ring.compactMap { c -> CLLocationCoordinate2D? in
                guard c.count >= 2 else { return nil }
                return CLLocationCoordinate2D(latitude: c[1], longitude: c[0])
            }
            guard !coords.isEmpty else { return nil }
            return MKPolygon(coordinates: &coords, count: coords.count)
        }
        let polygon = MKPolygon(coordinates: &outerCoords, count: outerCoords.count,
                                interiorPolygons: interiors.isEmpty ? nil : interiors)
        polygon.title = title
        return polygon
    }
}

// MARK: - GeoJSON Decodable models

private struct GeoJSONFeatureCollection: Decodable {
    let features: [GeoJSONFeature]
}

private struct GeoJSONFeature: Decodable {
    let geometry: GeoJSONGeometry
}

private enum GeoJSONGeometry: Decodable {
    case polygon([[[Double]]])
    case multiPolygon([[[[Double]]]])

    private enum CodingKeys: String, CodingKey { case type, coordinates }

    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        let type = try c.decode(String.self, forKey: .type)
        switch type {
        case "Polygon":
            self = .polygon(try c.decode([[[Double]]].self, forKey: .coordinates))
        case "MultiPolygon":
            self = .multiPolygon(try c.decode([[[[Double]]]].self, forKey: .coordinates))
        default:
            throw DecodingError.dataCorruptedError(forKey: .type, in: c, debugDescription: "Unknown geometry type: \(type)")
        }
    }
}
