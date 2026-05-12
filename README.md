# Mineração MG

Plataforma multiplataforma de visualização interativa da mineração de Minas Gerais. Permite explorar as 12 mesorregiões do estado, os minérios extraídos em cada uma e os municípios produtores.

Disponível em três plataformas: **Web** (React + Leaflet), **iOS** (SwiftUI + MapKit) e **Android** (Jetpack Compose + OpenStreetMap).

## Web

### Como rodar

```bash
cd web
npm install
npm run dev
```

Acesse `http://localhost:5173/mineracao-mg/`

> O projeto usa `base: '/mineracao-mg/'` no Vite para compatibilidade com o GitHub Pages. Por isso o prefixo é necessário mesmo em dev.

### Deploy

O projeto está configurado para GitHub Pages via GitHub Actions. Qualquer push na branch `main` dispara o deploy automático.

## iOS

### Requisitos

- Xcode 15.4+
- iOS 17.0+
- [XcodeGen](https://github.com/yonaskolb/XcodeGen)

### Como rodar

```bash
cd ios
xcodegen generate
open MineracaoMG.xcodeproj
```

Selecione um simulador e rode (⌘R).

### Stack

- **SwiftUI** — UI declarativa
- **MapKit** — mapa com polígonos GeoJSON e máscara inversa (even-odd fill)
- **NavigationStack** — navegação intra-sheet (minérios → detalhe / municípios)

## Android

### Requisitos

- Android Studio Hedgehog+
- SDK 26+ (target 34)

### Como rodar

1. Abra a pasta `android/` no Android Studio
2. Aguarde o Gradle sync
3. Selecione um emulador ou dispositivo e rode (▶)

### Stack

- **Jetpack Compose** — UI declarativa com Material3
- **osmdroid** — mapa OpenStreetMap com tiles CartoDB Dark Matter
- **Coil** — carregamento de imagens dos assets
- **kotlinx.serialization** — parsing de JSON

## Estrutura do projeto

```
web/
  src/
    pages/                    # Telas (Welcome, Map, Region, Minerals, MineralDetail, Municipalities)
    components/               # Componentes reutilizáveis (BackButton, RegionModal, LocaleSelector)
    hooks/                    # Hooks (useGeoJSON, useData, useLocale, useMunicipalities)
    data/
      minerals.json           # Dados de todos os minérios (pt/en/es)
      states/mg.json          # Regiões e municípios de MG
  public/
    images/minerals/          # Fotos dos minérios (.png)
    icons/                    # Ícones do app (favicon, PWA)

ios/
  MineracaoMG/
    Views/                    # SwiftUI views (ContentView, MapKitView, RegionSheet, etc.)
    ViewModels/               # AppData (state management)
    Models/                   # Mineral, Region, AppLocale
    Services/                 # DataService, GeoJSONService, MunicipalitiesService
    Resources/                # minerals.json, mg.json, Media.xcassets (imagens + AppIcon)
  project.yml                 # Configuração XcodeGen

android/
  app/src/main/
    kotlin/com/mineracaomg/
      ui/                     # Compose screens (MainScreen, MapView, RegionSheet, MineralDetail, etc.)
      ui/theme/               # Material3 theme (dark)
      AppViewModel.kt         # State management
      Models.kt               # Mineral, Region, AppLocale, SheetScreen
      DataService.kt          # Leitura de JSONs dos assets
      GeoJSONService.kt       # Fetch de GeoJSON do IBGE
    assets/                   # minerals.json, mg.json, imagens
    res/mipmap-*/             # Ícones do app (adaptive icon)
```

## Dados compartilhados

As três plataformas compartilham a mesma estrutura de dados:

- **minerals.json** — catálogo de minérios com título, descrição, foto e símbolo em três idiomas (pt/en/es)
- **mg.json** — mapeamento de mesorregiões para seus minérios
- **GeoJSON** — polígonos das mesorregiões buscados em runtime da API do IBGE

## Adicionando um novo minério

1. Adicione a entrada em `minerals.json` (web, iOS e Android têm cópias independentes):

```json
"id-do-minerio": {
  "id": "id-do-minerio",
  "title": "Nome em português",
  "title_en": "Name in English",
  "title_es": "Nombre en español",
  "description": "Descrição em português.",
  "description_en": "",
  "description_es": "",
  "photo": "/images/minerals/id-do-minerio.png",
  "source": "Crédito da foto",
  "symbol": "Xx",
  "tagline": "Uso principal",
  "tagline_en": "Main use",
  "tagline_es": "Uso principal"
}
```

2. Salve a foto em `web/public/images/minerals/`, `ios/MineracaoMG/Resources/Media.xcassets/` (como imageset) e `android/app/src/main/assets/images/minerals/`.

3. Adicione o `id` no array `minerals` da região correspondente em `mg.json` de cada plataforma.
