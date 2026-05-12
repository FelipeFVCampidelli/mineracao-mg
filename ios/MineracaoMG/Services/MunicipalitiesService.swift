import Foundation

final class MunicipalitiesService {

    static let shared = MunicipalitiesService()
    private init() {}

    private var cache: [String: [String]] = [:]

    func fetch(regionId: String) async throws -> [String] {
        if let cached = cache[regionId] { return cached }

        guard let region = Region.find(regionId) else { return [] }
        let url = URL(string: "https://servicodados.ibge.gov.br/api/v1/localidades/mesorregioes/\(region.ibgeCode)/municipios")!
        let (data, _) = try await URLSession.shared.data(from: url)
        let raw = try JSONDecoder().decode([MunicipioJSON].self, from: data)
        let names = raw.map { $0.nome }.sorted { $0.localizedCompare($1) == .orderedAscending }
        cache[regionId] = names
        return names
    }

    private struct MunicipioJSON: Decodable {
        let nome: String
    }
}
