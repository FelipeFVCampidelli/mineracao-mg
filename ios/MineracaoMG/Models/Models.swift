import Foundation
import SwiftUI

// MARK: - Mineral

struct Mineral: Codable, Identifiable, Hashable {
    let id: String
    let title: String
    let title_en: String?
    let title_es: String?
    let description: String
    let description_en: String?
    let description_es: String?
    let photo: String?
    let source: String?
    let symbol: String?
    let tagline: String?
    let tagline_en: String?
    let tagline_es: String?

    func localizedTitle(locale: AppLocale) -> String {
        switch locale {
        case .en: return nonEmpty(title_en) ?? title
        case .es: return nonEmpty(title_es) ?? title
        case .pt: return title
        }
    }

    func localizedDescription(locale: AppLocale) -> String {
        switch locale {
        case .en: return nonEmpty(description_en) ?? description
        case .es: return nonEmpty(description_es) ?? description
        case .pt: return description
        }
    }

    func localizedTagline(locale: AppLocale) -> String {
        switch locale {
        case .en: return nonEmpty(tagline_en) ?? tagline ?? ""
        case .es: return nonEmpty(tagline_es) ?? tagline ?? ""
        case .pt: return tagline ?? ""
        }
    }

    /// Returns a color for the symbol badge, derived from a static palette keyed by mineral id.
    var badgeColor: Color { Color(hex: Mineral.badgePalette[id] ?? "#666666") ?? .gray }

    private static let badgePalette: [String: String] = [
        "ferro":        "#8B4513",   // rust brown
        "ouro":         "#B8860B",   // dark gold
        "diamante":     "#5B8DB8",   // ice blue
        "granito":      "#696969",   // stone gray
        "litio":        "#607D8B",   // blue-gray
        "calcario":     "#8D7355",   // limestone tan
        "niobio":       "#3B5EA6",   // metallic blue
        "fosfato":      "#4A7C59",   // mineral green
        "prata":        "#9E9E9E",   // silver
        "chumbo":       "#6B7B8D",   // lead blue-gray
        "tantalo":      "#4A6FA5",   // steel blue
        "bauxita":      "#A0522D",   // sienna red
        "quartzo":      "#7986CB",   // quartz purple
        "zinco":        "#5B7FA6",   // zinc blue
        "estanho":      "#9E7E5A",   // tin bronze
        "caulim":       "#A0948A",   // kaolin clay
        "silica":       "#4B8BBE",   // silica blue
        "terra-rara":   "#7B4F9E",   // rare earth purple
        "manganes":     "#757575",   // manganese gray
        "niquel":       "#78909C",   // nickel gray
        "agua-mineral": "#1565C0",   // water blue
        "cobre":        "#B87333",   // copper
    ]

    private func nonEmpty(_ s: String?) -> String? {
        guard let s, !s.isEmpty else { return nil }
        return s
    }
}

// MARK: - Region

struct Region: Identifiable, Hashable {
    let id: String
    let name: String
    let colorHex: String
    let ibgeCode: Int

    var color: Color { Color(hex: colorHex) ?? .gray }
    var uiColor: UIColor { UIColor(hex: colorHex) ?? .gray }
}

extension Region {
    static let all: [Region] = [
        Region(id: "jequitinhonha",       name: "Jequitinhonha",         colorHex: "#FF00FF", ibgeCode: 3103),
        Region(id: "norte-de-minas",      name: "Norte de Minas",        colorHex: "#7B4F2E", ibgeCode: 3102),
        Region(id: "noroeste-de-minas",   name: "Noroeste de Minas",     colorHex: "#A8B8C8", ibgeCode: 3101),
        Region(id: "triangulo-mineiro",   name: "Triângulo Mineiro",     colorHex: "#7ECECA", ibgeCode: 3105),
        Region(id: "sul-sudoeste",        name: "Sul e Sudoeste",        colorHex: "#6B2D8B", ibgeCode: 3110),
        Region(id: "central-mineira",     name: "Central Mineira",       colorHex: "#00BCD4", ibgeCode: 3106),
        Region(id: "oeste-de-minas",      name: "Oeste de Minas",        colorHex: "#C8B400", ibgeCode: 3109),
        Region(id: "campo-das-vertentes", name: "Campo das Vertentes",   colorHex: "#787878", ibgeCode: 3111),
        Region(id: "metropolitana-bh",    name: "Metropolitana de BH",   colorHex: "#D2691E", ibgeCode: 3107),
        Region(id: "zona-da-mata",        name: "Zona da Mata",          colorHex: "#1A3EBF", ibgeCode: 3112),
        Region(id: "vale-do-rio-doce",    name: "Vale do Rio Doce",      colorHex: "#2E8B57", ibgeCode: 3108),
        Region(id: "vale-do-mucuri",      name: "Vale do Mucuri",        colorHex: "#A52A2A", ibgeCode: 3104),
    ]

    static func find(_ id: String) -> Region? {
        all.first { $0.id == id }
    }
}

// MARK: - Locale

enum AppLocale: String, CaseIterable {
    case pt = "PT"
    case en = "EN"
    case es = "ES"
}

// MARK: - Sheet navigation

enum SheetDestination: Hashable {
    case minerals
    case municipalities
    case mineralDetail(id: String)
}
