import SwiftUI

// MARK: - RegionSheetView
// Root of the bottom sheet navigation: region home → minerals/municipalities → mineral detail

struct RegionSheetView: View {

    let region: Region
    @ObservedObject var appData: AppData
    @State private var path = NavigationPath()

    var body: some View {
        NavigationStack(path: $path) {
            RegionHomeView(region: region, appData: appData, path: $path)
                .navigationBarHidden(true)
        }
    }
}

// MARK: - RegionHomeView (minerals list is the landing)

struct RegionHomeView: View {

    let region: Region
    @ObservedObject var appData: AppData
    @Binding var path: NavigationPath
    @Environment(\.dismiss) private var dismiss

    var minerals: [Mineral] { appData.mineralsForRegion(region.id) }

    var body: some View {
        VStack(spacing: 0) {
            // Header
            SheetHeader(title: "Minérios", regionName: region.name, regionColor: region.color) {
                dismiss()
            }

            // Minerals list
            ScrollView(showsIndicators: false) {
                VStack(spacing: 0) {
                    if minerals.isEmpty {
                        Text("Sem dados disponíveis.")
                            .font(.system(size: 14))
                            .foregroundStyle(Color(white: 0.4))
                            .padding(.top, 40)
                    } else {
                        ForEach(minerals) { mineral in
                            NavigationLink(value: SheetDestination.mineralDetail(id: mineral.id)) {
                                MineralRow(mineral: mineral, locale: appData.locale)
                            }
                            .buttonStyle(.plain)
                            Divider().background(Color(white: 0.12)).padding(.leading, 56)
                        }
                    }

                    // Municipalities button
                    NavigationLink(value: SheetDestination.municipalities) {
                        MunicipalitiesButton()
                    }
                    .buttonStyle(.plain)
                    .padding(.top, 24)
                    .padding(.bottom, 32)
                }
                .padding(.horizontal, 4)
            }
        }
        .navigationDestination(for: SheetDestination.self) { dest in
            switch dest {
            case .minerals:
                EmptyView()
            case .municipalities:
                MunicipalitiesView(region: region, path: $path)
            case .mineralDetail(let id):
                if let mineral = appData.minerals[id] {
                    MineralDetailView(mineral: mineral, locale: appData.locale, path: $path)
                }
            }
        }
    }
}

// MARK: - SheetHeader

struct SheetHeader: View {
    let title: String
    let regionName: String
    let regionColor: Color
    let onBack: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Back button
            Button(action: onBack) {
                HStack(spacing: 6) {
                    Image(systemName: "arrow.left")
                        .font(.system(size: 13, weight: .medium))
                    Text("Voltar")
                        .font(.system(size: 13, weight: .medium))
                    Spacer()
                }
                .foregroundStyle(Color(white: 0.55))
                .padding(.vertical, 12)
                .padding(.horizontal, 20)
                .contentShape(Rectangle())
            }
            .padding(.top, 8)

            // Title + region badge
            HStack(alignment: .center, spacing: 14) {
                Text(title)
                    .font(.system(size: 26, weight: .light))
                    .foregroundStyle(.white)
                Spacer()
                HStack(spacing: 5) {
                    Circle()
                        .fill(regionColor)
                        .frame(width: 8, height: 8)
                    Text(regionName)
                        .font(.system(size: 12, weight: .regular))
                        .foregroundStyle(Color(white: 0.5))
                }
            }
            .padding(.horizontal, 20)
            .padding(.top, 16)
            .padding(.bottom, 20)

            Divider().background(Color(white: 0.12))
        }
    }
}

// MARK: - MunicipalitiesButton

struct MunicipalitiesButton: View {
    var body: some View {
        HStack {
            Image(systemName: "building.2")
                .font(.system(size: 16))
                .foregroundStyle(Color(white: 0.5))
                .frame(width: 36, height: 36)
                .background(Color(white: 0.12))
                .clipShape(RoundedRectangle(cornerRadius: 8))

            Text("Ver Municípios")
                .font(.system(size: 15, weight: .regular))
                .foregroundStyle(Color(white: 0.8))

            Spacer()

            Image(systemName: "chevron.right")
                .font(.system(size: 12, weight: .semibold))
                .foregroundStyle(Color(white: 0.3))
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 14)
        .background(Color(white: 0.08))
        .clipShape(RoundedRectangle(cornerRadius: 10))
        .padding(.horizontal, 12)
    }
}
