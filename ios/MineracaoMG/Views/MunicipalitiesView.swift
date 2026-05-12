import SwiftUI

// MARK: - MunicipalitiesView

struct MunicipalitiesView: View {

    let region: Region
    @Binding var path: NavigationPath

    @State private var municipalities: [String] = []
    @State private var loading = true

    private let columns = [
        GridItem(.flexible(), alignment: .leading),
        GridItem(.flexible(), alignment: .leading),
    ]

    var body: some View {
        VStack(spacing: 0) {
            // Header
            SheetHeader(title: "Municípios", regionName: region.name, regionColor: region.color) {
                path.removeLast()
            }

            // Grid
            ScrollView(showsIndicators: false) {
                if loading {
                    ProgressView()
                        .tint(Color(white: 0.4))
                        .padding(.top, 60)
                } else if municipalities.isEmpty {
                    Text("Sem dados disponíveis.")
                        .font(.system(size: 14))
                        .foregroundStyle(Color(white: 0.4))
                        .padding(.top, 40)
                } else {
                    LazyVGrid(columns: columns, spacing: 0) {
                        ForEach(municipalities, id: \.self) { name in
                            VStack(alignment: .leading, spacing: 0) {
                                Text(name)
                                    .font(.system(size: 14, weight: .regular))
                                    .foregroundStyle(Color(white: 0.8))
                                    .padding(.vertical, 14)
                                    .padding(.horizontal, 4)
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                Divider().background(Color(white: 0.1))
                            }
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.bottom, 40)
                }
            }
        }
        .navigationBarHidden(true)
        .background(Color(hex: "#121212") ?? .black)
        .task {
            do {
                municipalities = try await MunicipalitiesService.shared.fetch(regionId: region.id)
            } catch {
                print("[MunicipalitiesView] error:", error)
            }
            loading = false
        }
    }
}
