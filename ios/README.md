# Mineração MG — iOS

App nativo para iOS construído com SwiftUI e MapKit.

## Pré-requisitos

- Xcode 15.4+
- iOS 17.0+ (simulador ou device)
- [xcodegen](https://github.com/yonaskolb/XcodeGen): `brew install xcodegen`

## Como rodar

```bash
cd ios
xcodegen generate        # gera o MineracaoMG.xcodeproj
open MineracaoMG.xcodeproj
```

No Xcode: selecione um simulador iPhone e pressione **⌘R**.

## Sincronizar dados

Os JSONs de `data/` na raiz do repositório são a fonte de verdade. Para sincronizar com os recursos do app:

```bash
cd ..  # raiz do repositório
./sync-data.sh
```

## Adicionar imagens dos minérios

1. Adicione os PNGs em `ios/Resources/` com o mesmo nome do arquivo (ex: `ferro.png`)
2. No Xcode, adicione os arquivos ao target `MineracaoMG`
3. O `MineralDetailView` carrega a imagem pelo `lastPathComponent` do campo `photo` do JSON

## Estrutura

```
ios/
  project.yml                  # spec do xcodegen
  MineracaoMG/
    MineracaoMGApp.swift        # ponto de entrada
    Models/
      Models.swift              # Mineral, Region, AppLocale, SheetDestination
    Services/
      DataService.swift         # lê minerals.json e mg.json do bundle
      GeoJSONService.swift      # busca GeoJSON das mesorregiões da API do IBGE
      MunicipalitiesService.swift  # busca municípios da API do IBGE
    ViewModels/
      AppData.swift             # ObservableObject central
    Views/
      ContentView.swift         # tela principal (mapa + lista de regiões)
      MapKitView.swift          # mapa MapKit não-interativo com polígonos coloridos
      RegionSheetView.swift     # bottom sheet (navegação entre minérios/municípios)
      MineralsListView.swift    # linha de minério + badge de símbolo
      MineralDetailView.swift   # detalhe do minério (foto, título, descrição)
      MunicipalitiesView.swift  # grid de municípios
    Utils/
      Extensions.swift          # Color(hex:), UIColor(hex:), etc.
  Resources/
    minerals.json               # cópia de ../../data/minerals.json
    mg.json                     # cópia de ../../data/states/mg.json
```

## Mapa

- Usa **MapKit nativo** (sem dependências externas)
- Tiles de satélite (`mapType = .satellite`)
- 12 polígonos coloridos das mesorregiões, buscados da API do IBGE v3
- Polígono de máscara inversa: retângulo mundial com MG recortado — esconde tudo fora de MG
- Todas as interações desabilitadas (sem scroll, zoom ou rotação)
- Toque em qualquer região (no mapa ou na lista) abre o bottom sheet
