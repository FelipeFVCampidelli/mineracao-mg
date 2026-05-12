import SwiftUI

// MARK: - MineralRow
// Used in both RegionHomeView and anywhere a mineral list is needed.

struct MineralRow: View {

    let mineral: Mineral
    let locale: AppLocale

    var body: some View {
        HStack(spacing: 14) {
            // Symbol badge
            SymbolBadge(symbol: mineral.symbol ?? "?", color: mineral.badgeColor)

            // Title
            Text(mineral.localizedTitle(locale: locale))
                .font(.system(size: 15, weight: .regular))
                .foregroundStyle(.white)
                .lineLimit(1)

            Spacer()

            Image(systemName: "chevron.right")
                .font(.system(size: 11, weight: .semibold))
                .foregroundStyle(Color(white: 0.3))
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 14)
        .contentShape(Rectangle())
    }
}

// MARK: - SymbolBadge

struct SymbolBadge: View {

    let symbol: String
    let color: Color

    var body: some View {
        Text(symbol)
            .font(.system(size: symbol.count > 2 ? 9 : 11, weight: .semibold, design: .monospaced))
            .foregroundStyle(.white)
            .frame(width: 36, height: 36)
            .background(color.opacity(0.7))
            .clipShape(RoundedRectangle(cornerRadius: 8))
    }
}
