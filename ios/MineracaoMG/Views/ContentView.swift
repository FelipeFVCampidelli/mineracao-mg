import SwiftUI

// MARK: - ContentView

struct ContentView: View {

    @StateObject private var appData = AppData()

    var body: some View {
        ZStack {
            Color(hex: "#0d0d0d")?.ignoresSafeArea()

            VStack(spacing: 0) {
                // ── Header (fixed)
                headerView

                // ── Map (fixed)
                mapCard

                // ── Region list (scrollable)
                regionListHeader
                ScrollView(showsIndicators: false) {
                    regionList
                }
            }
        }
        .preferredColorScheme(.dark)
        .sheet(item: Binding(
            get: { appData.selectedRegionId.flatMap { Region.find($0) } },
            set: {
                appData.selectedRegionId = $0?.id
                appData.highlightedRegionId = $0?.id
            }
        )) { region in
            RegionSheetView(region: region, appData: appData)
                .presentationDetents([.medium, .large])
                .presentationDragIndicator(.visible)
                .presentationCornerRadius(20)
                .presentationBackground(Color(hex: "#121212") ?? .black)
        }
        .onChange(of: appData.selectedRegionId) { _, newValue in
            appData.highlightedRegionId = newValue
        }
    }

    // MARK: Sub-views

    private var headerView: some View {
        VStack(alignment: .leading, spacing: 2) {
            Text("Mineração em\nMinas Gerais")
                .font(.system(size: 28, weight: .light))
                .foregroundStyle(.white)
            Text("\(Region.all.count) MESORREGIÕES")
                .font(.system(size: 11, weight: .medium))
                .foregroundStyle(Color(white: 0.5))
                .tracking(1.5)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.horizontal, 20)
        .padding(.top, 16)
        .padding(.bottom, 16)
    }

    private var mapCard: some View {
        MapKitView(appData: appData) { regionId in
            appData.selectedRegionId = regionId
        }
        .frame(height: 260)
        .clipShape(RoundedRectangle(cornerRadius: 10))
        .overlay(
            RoundedRectangle(cornerRadius: 10)
                .strokeBorder(Color(white: 0.15), lineWidth: 0.5)
        )
        .padding(.horizontal, 16)
        .overlay {
            if !appData.mapReady {
                RoundedRectangle(cornerRadius: 10)
                    .fill(Color(white: 0.08))
                    .padding(.horizontal, 16)
                    .overlay {
                        ProgressView()
                            .tint(Color(white: 0.4))
                    }
            }
        }
    }

    private var regionListHeader: some View {
        HStack {
            Text("Mesorregiões")
                .font(.system(size: 20, weight: .regular))
                .foregroundStyle(.white)
            Spacer()
        }
        .padding(.horizontal, 20)
        .padding(.top, 28)
        .padding(.bottom, 8)
    }

    private var regionList: some View {
        LazyVStack(spacing: 0) {
            ForEach(Region.all) { region in
                RegionRow(region: region, appData: appData)
                    .onTapGesture { appData.selectedRegionId = region.id }
                    .onLongPressGesture(minimumDuration: 0.4) {
                        let generator = UIImpactFeedbackGenerator(style: .medium)
                        generator.impactOccurred()
                        withAnimation(.easeInOut(duration: 0.25)) {
                            appData.highlightedRegionId = region.id
                        }
                        // Auto-dismiss after 2 seconds
                        DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                            withAnimation(.easeOut(duration: 0.4)) {
                                if appData.highlightedRegionId == region.id {
                                    appData.highlightedRegionId = nil
                                }
                            }
                        }
                    }
                Divider()
                    .background(Color(white: 0.12))
                    .padding(.leading, 56)
            }
        }
        .padding(.horizontal, 4)
        .padding(.bottom, 40)
    }
}

// MARK: - RegionRow

struct RegionRow: View {

    let region: Region
    @ObservedObject var appData: AppData

    private var mineralCount: Int { appData.regionMinerals[region.id]?.count ?? 0 }
    private var isHighlighted: Bool { appData.highlightedRegionId == region.id }

    var body: some View {
        HStack(spacing: 14) {
            // Color square
            RoundedRectangle(cornerRadius: 8)
                .fill(region.color)
                .frame(width: 36, height: 36)

            // Text
            VStack(alignment: .leading, spacing: 3) {
                Text(region.name)
                    .font(.system(size: 16, weight: .regular))
                    .foregroundStyle(.white)
                Text("\(mineralCount) minério\(mineralCount == 1 ? "" : "s")")
                    .font(.system(size: 12, weight: .regular))
                    .foregroundStyle(Color(white: 0.45))
            }

            Spacer()

            Image(systemName: "chevron.right")
                .font(.system(size: 12, weight: .semibold))
                .foregroundStyle(Color(white: 0.3))
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 14)
        .background(
            RoundedRectangle(cornerRadius: 10)
                .fill(region.color.opacity(isHighlighted ? 0.18 : 0))
        )
        .contentShape(Rectangle())
        .animation(.easeInOut(duration: 0.25), value: isHighlighted)
    }
}
