# Mineração MG

Plataforma de visualização interativa da mineração de Minas Gerais. Permite explorar as 12 mesorregiões do estado, os minérios extraídos em cada uma e os municípios produtores. Suporta português, inglês e espanhol.

## Como rodar localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173/mineracao-mg/`

> O projeto usa `base: '/mineracao-mg/'` no Vite para compatibilidade com o GitHub Pages. Por isso o prefixo é necessário mesmo em dev.

## Estrutura do projeto

```
src/
  pages/
    WelcomeScreen.jsx       # Tela inicial (2 steps)
    MapPage.jsx             # Mapa principal com GeoJSON do IBGE
    RegionPage.jsx          # Tela de região (Minérios / Municípios)
    MineralsPage.jsx        # Lista de minérios da região
    MunicipalitiesPage.jsx  # Lista de municípios (paginada)
    MineralDetailPage.jsx   # Detalhe do minério com foto e descrição

  components/
    BackButton.jsx          # Botão de voltar reutilizável
    RegionModal.jsx         # Modal de detalhe ao clicar numa região no mapa
    RegionShape.jsx         # Miniatura do shape da região no modal
    LocaleSelector.jsx      # Seletor de idioma (PT / EN / ES)

  hooks/
    useGeoJSON.js           # Busca GeoJSON das mesorregiões da API do IBGE em runtime
    useData.js              # Lê os JSONs de regiões e minérios
    useLocale.js            # Gerencia o idioma ativo (global, sem Context)
    useMunicipalities.js    # Carrega e filtra municípios por região

  data/
    index.js                # Registro central de estados e regiões
    i18n.json               # Strings de UI traduzidas (pt / en / es)
    minerals.json           # Dados de todos os minérios
    states/
      mg.json               # Regiões e municípios de MG

  styles/
    global.css              # Variáveis CSS e reset global

public/
  images/
    minerals/               # Fotos dos minérios (.png)
```

## Formato do minerals.json

Cada entrada em `src/data/minerals.json` segue o formato:

```json
"id-do-minerio": {
  "id": "id-do-minerio",
  "title": "Nome em português",
  "title_en": "Name in English",
  "title_es": "Nombre en español",
  "description": "Descrição em português.\n\nParágrafo separado por linha em branco.",
  "description_en": "",
  "description_es": "",
  "photo": "/images/minerals/id-do-minerio.png",
  "source": "Crédito da foto"
}
```

A foto deve ser salva em `public/images/minerals/` e o campo `photo` usa caminho absoluto a partir da raiz pública (o `BASE_URL` do Vite é aplicado automaticamente nos componentes).

## Adicionando um novo minério

1. Adicione a entrada no `src/data/minerals.json` seguindo o formato acima.
2. Salve a foto em `public/images/minerals/id-do-minerio.png`.
3. Adicione o `id` no array `minerals` da região correspondente em `src/data/states/mg.json`.
4. Adicione o nome de exibição nos três idiomas em `MINERAL_NAMES` dentro de `src/components/RegionModal.jsx` e em `src/pages/MineralsPage.jsx`.

## Expandindo para outros estados

1. Adicione o estado em `src/data/index.js`:

```js
sp: {
  id: 'sp',
  name: 'São Paulo',
  bounds: [[-25.3, -53.1], [-19.8, -44.2]],
  ibgeCode: 35,
  regions: [
    { id: 'metropolitana-sp', name: 'Metropolitana de SP', color: '#FF6B6B', ibgeName: 'Metropolitana de São Paulo' },
    // ...
  ]
}
```

2. Crie `src/data/states/sp.json` com as regiões e municípios, seguindo a estrutura de `mg.json`.

3. Atualize `src/hooks/useData.js` para carregar o novo estado.

4. O fluxo de rotas `/:stateId/:regionId` já suporta múltiplos estados sem alteração.

## Deploy

O projeto está configurado para GitHub Pages via GitHub Actions. Qualquer push na branch `main` dispara o deploy automático.
