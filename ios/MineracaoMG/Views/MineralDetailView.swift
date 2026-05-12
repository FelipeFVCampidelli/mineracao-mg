import SwiftUI

// MARK: - MineralDetailView

struct MineralDetailView: View {

    let mineral: Mineral
    let locale: AppLocale
    @Binding var path: NavigationPath

    private var title: String { mineral.localizedTitle(locale: locale) }
    private var description: String { mineral.localizedDescription(locale: locale) }

    var body: some View {
        VStack(spacing: 0) {
            // Back — outside ScrollView for reliable tap detection
            Button(action: { path.removeLast() }) {
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

            ScrollView(showsIndicators: false) {
                VStack(alignment: .leading, spacing: 0) {
                // Photo
                if let photoName = mineral.photo.flatMap({ URL(string: $0)?.lastPathComponent }),
                   !photoName.isEmpty {
                    MineralPhotoView(imageName: photoName, source: mineral.source)
                }

                // Title
                VStack(alignment: .leading, spacing: 6) {
                    Text(title)
                        .font(.system(size: 28, weight: .light))
                        .foregroundStyle(.white)
                        .padding(.top, 24)

                    if let tagline = mineral.localizedTagline(locale: locale) as String?,
                       !tagline.isEmpty {
                        Text(tagline)
                            .font(.system(size: 13, weight: .regular))
                            .foregroundStyle(Color(white: 0.45))
                    }
                }
                .padding(.horizontal, 20)

                // Description
                if !description.isEmpty {
                    VStack(alignment: .leading, spacing: 14) {
                        ForEach(description.components(separatedBy: "\n\n"), id: \.self) { paragraph in
                            if !paragraph.isBlank {
                                Text(paragraph)
                                    .font(.system(size: 14, weight: .light))
                                    .foregroundStyle(Color(white: 0.85))
                                    .lineSpacing(5)
                                    .fixedSize(horizontal: false, vertical: true)
                                }
                            }
                        }
                        .padding(.horizontal, 20)
                        .padding(.top, 20)
                    }

                Spacer(minLength: 48)
                }
            }
        }
        .toolbar(.hidden, for: .navigationBar)
        .background(Color(hex: "#121212") ?? .black)
    }
}

// MARK: - MineralPhotoView

struct MineralPhotoView: View {

    let imageName: String
    let source: String?

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            if let uiImage = Self.loadImage(named: imageName) {
                Image(uiImage: uiImage)
                    .resizable()
                    .scaledToFill()
                    .frame(maxWidth: .infinity)
                    .frame(height: 240)
                    .clipped()
            } else {
                // Placeholder when image is not bundled
                Rectangle()
                    .fill(Color(white: 0.12))
                    .frame(maxWidth: .infinity)
                    .frame(height: 240)
                    .overlay {
                        Image(systemName: "photo")
                            .font(.system(size: 32))
                            .foregroundStyle(Color(white: 0.25))
                    }
            }

            if let source, !source.isEmpty, !source.hasPrefix("<") {
                Text("Fonte: \(source)")
                    .font(.system(size: 11))
                    .foregroundStyle(Color(white: 0.35))
                    .padding(.horizontal, 20)
                    .padding(.top, 8)
            }
        }
    }

    /// Loads an image from the bundle, trying multiple strategies:
    /// 1. UIImage(named:) — works for asset catalogs and some loose files
    /// 2. Bundle.main path lookup — works for loose files in bundle root or Resources/
    private static func loadImage(named name: String) -> UIImage? {
        let baseName = (name as NSString).deletingPathExtension
        let ext = (name as NSString).pathExtension.isEmpty ? "png" : (name as NSString).pathExtension

        // 1. Asset catalog / bundle root
        if let img = UIImage(named: baseName) { return img }
        if let img = UIImage(named: name) { return img }

        // 2. Loose file at bundle root
        if let path = Bundle.main.path(forResource: baseName, ofType: ext),
           let img = UIImage(contentsOfFile: path) { return img }

        // 3. Loose file inside Resources/ subdirectory
        if let url = Bundle.main.url(forResource: baseName, withExtension: ext, subdirectory: "Resources"),
           let data = try? Data(contentsOf: url),
           let img = UIImage(data: data) { return img }

        return nil
    }
}
