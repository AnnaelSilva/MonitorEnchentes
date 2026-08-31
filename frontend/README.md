# Frontend - AquaAlert (React + Leaflet + Firebase)

Interface web interativa para monitoramento em tempo real de enchentes, alagamentos e previsão de chuvas.

## Funcionalidades
- **Mapa Leaflet Interativo**: visualização de mapa em tela cheia com marcadores coloridos por gravidade.
- **Sincronização em Tempo Real (Firebase Firestore)**: novos alertas aparecem instantaneamente em todas as telas abertas via listeners `onSnapshot`.
- **Previsão Pluviométrica (FastAPI + Open-Meteo)**: exibe volume de chuva (mm), probabilidade (%) e risco de inundação para as coordenadas do mapa.
- **Reporte Colaborativo**: formulário intuitivo para usuários registrarem ocorrências.

## Como Executar

1. Instale as dependências:
```bash
npm install
```

2. Configure o arquivo `.env` (opcional caso queira conectar ao seu próprio Firestore):
```bash
cp .env.example .env
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse no navegador:
`http://localhost:5173`
