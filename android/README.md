# Mineração MG — Android

App nativo para Android construído com Kotlin + Jetpack Compose + Google Maps SDK.

## Pré-requisitos

- Android Studio Hedgehog (2023.1.1) ou mais recente
- SDK Android 26+
- Uma chave de API do Google Maps com **Maps SDK for Android** habilitado

## Configuração da chave de API

1. Acesse [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
2. Crie uma API Key e habilite "Maps SDK for Android"
3. Na pasta `android/`, copie `local.defaults.properties` para `local.properties`:
   ```bash
   cp local.defaults.properties local.properties
   ```
4. Edite `local.properties` e substitua `YOUR_MAPS_API_KEY_HERE` pela sua chave

## Como rodar

1. Abra a pasta `android/` no Android Studio
2. Aguarde o sync do Gradle
3. Selecione um emulador ou device e pressione **▶ Run**

## Sincronizar dados

Os JSONs em `data/` na raiz do repositório são a fonte de verdade. Para sincronizar:

```bash
cd ..  # raiz do repositório
./sync-data.sh
```

Isso copia `minerals.json`, `mg.json` e as imagens dos minérios para os assets do app.

## Estrutura

```
android/
  build.gradle.kts               # plugins (AGP, Kotlin, Serialization)
  settings.gradle.kts
  gradle.properties
  local.defaults.properties      # template — copiar para local.properties
  app/
    build.gradle.kts             # dependências do app
    src/main/
      AndroidManifest.xml
      kotlin/com/mineracaomg/
        MainActivity.kt
        Models.kt                # Mineral, Region, AppLocale, SheetScreen
        DataService.kt           # lê minerals.json e mg.json dos assets
        GeoJSONService.kt        # busca GeoJSON das mesorregiões da API do IBGE
        MunicipalitiesService.kt # busca municípios da API do IBGE
        AppViewModel.kt          # StateFlow central
        ui/
          theme/Theme.kt         # tema dark (Material3)
          MainScreen.kt          # tela principal (mapa + lista de regiões + locale picker)
          MapView.kt             # GoogleMap com tiles satélite, polígonos e máscara inversa
          RegionSheet.kt         # ModalBottomSheet com navegação interna
          MineralDetail.kt       # detalhe do minério
          MunicipalitiesScreen.kt
      assets/
        minerals.json
        mg.json
        images/minerals/         # PNGs dos minérios
```

## Mapa

- **Google Maps SDK** com `MapType.SATELLITE`
- 12 polígonos coloridos das mesorregiões buscados da API do IBGE v3
- Polígono de máscara inversa (retângulo mundial com MG como hole) esconde tudo fora do estado
- Todas as interações desabilitadas (sem scroll, zoom ou rotação)
- Toque em qualquer região abre o bottom sheet

## Dependências principais

| Biblioteca | Versão | Uso |
|---|---|---|
| Jetpack Compose BOM | 2024.05.00 | UI |
| maps-compose | 4.3.3 | Mapa |
| Coil | 2.6.0 | Imagens dos assets |
| kotlinx.serialization | 1.6.3 | Parse de JSON |
