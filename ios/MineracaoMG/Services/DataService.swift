import Foundation

// MARK: - DataService
// Loads JSON files bundled in the app resources.

final class DataService {

    static let shared = DataService()
    private init() {}

    // MARK: Minerals

    func loadMinerals() -> [String: Mineral] {
        guard let data = bundleData(name: "minerals", ext: "json") else {
            print("[DataService] ❌ minerals.json not found in bundle")
            return [:]
        }
        do {
            let dict = try JSONDecoder().decode([String: Mineral].self, from: data)
            print("[DataService] ✅ Loaded \(dict.count) minerals")
            return dict
        } catch {
            print("[DataService] ❌ Failed to decode minerals.json:", error)
            return [:]
        }
    }

    // MARK: Region minerals

    func loadRegionMinerals() -> [String: [String]] {
        guard let data = bundleData(name: "mg", ext: "json") else {
            print("[DataService] ❌ mg.json not found in bundle")
            return [:]
        }
        do {
            let raw = try JSONDecoder().decode([String: RegionJSON].self, from: data)
            let result = raw.mapValues { $0.minerals }
            print("[DataService] ✅ Loaded regions: \(result.keys.sorted().joined(separator: ", "))")
            return result
        } catch {
            print("[DataService] ❌ Failed to decode mg.json:", error)
            return [:]
        }
    }

    // MARK: Bundle helper

    private func bundleData(name: String, ext: String) -> Data? {
        guard let url = Bundle.main.url(forResource: name, withExtension: ext) else {
            print("[DataService] Bundle.main has no \(name).\(ext)")
            return nil
        }
        return try? Data(contentsOf: url)
    }

    // MARK: Private helpers

    private struct RegionJSON: Decodable {
        let minerals: [String]
    }
}
