# Mineração MG

Plataforma de visualização da mineração de Minas Gerais.

## Como rodar localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`

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

  hooks/
    useGeoJSON.js           # Busca GeoJSON do IBGE em runtime
    useData.js              # Carrega JSONs de regiões e minérios

  data/
    index.js                # Registro central de estados e regiões
    states/
      mg/
        regions/            # Um JSON por mesorregião com minerals[] e municipalities[]
    minerals/               # Um JSON por minério com foto, descrição e usos
```

## Expandindo para outros estados

1. Adicione o estado em `src/data/index.js`:
```js
sp: {
  id: 'sp',
  name: 'São Paulo',
  bounds: [...],
  ibgeCode: 35,
  regions: [...]
}
```

2. Crie a pasta `src/data/states/sp/regions/` com os JSONs de cada mesorregião.

3. Adicione os loaders em `src/hooks/useData.js`.

4. Pronto — o mapa já suporta múltiplos estados pelo mesmo fluxo de rotas `/:stateId/:regionId`.

## Adicionando minérios

Crie um arquivo em `src/data/minerals/nome-do-minerio.json`:
```json
{
  "id": "nome-do-minerio",
  "name": "Nome Exibido",
  "subtitle": "Variantes",
  "symbol": "Símbolo",
  "photo": "URL da foto",
  "photoCredit": "Crédito",
  "description": "Descrição em parágrafos separados por linha em branco.",
  "uses": ["Uso 1", "Uso 2"]
}
```

Depois adicione o loader em `src/hooks/useData.js` e o nome de exibição em `MineralsPage.jsx`.
