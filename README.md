#  AquaAlert - Sistema de Monitoramento Climático e Alertas de Enchente

Projeto acadêmico Full-Stack para monitoramento meteorológico e alertas colaborativos de enchentes em tempo real, integrando **React.js**, **Leaflet**, **FastAPI (Python)**, **Firebase Firestore** e a API pública **Open-Meteo**.

---

##  Arquitetura do Sistema

```mermaid
graph TD
    subgraph "Cliente (Frontend)"
        A["React.js + Leaflet"] -->|"1. onSnapshot (Tempo Real WebSocket/HTTP)|" B["Firebase Firestore"]
        A -->|"2. POST novo alerta"| B
        A -->|"3. GET /api/weather (lat, lon)"| C["Backend FastAPI"]
    end

    subgraph "Nuvem & APIs Externas"
        C -->|"4. Consulta dados climáticos"| D["API Open-Meteo (Gratuita)"]
        D -->|"5. Retorna chuva, umidade, vento, WMO"| C
        C -->|"6. Retorna volume mm, % chuva & Risco"| A
        B -->|"7. Propaga marcadores para todos os clientes"| A
    end
```

---

## Estrutura de Diretórios

```text
flood-monitor/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                  # Endpoints FastAPI e configuração de CORS
│   │   ├── config.py                # Configurações do servidor
│   │   ├── schemas/
│   │   │   └── weather.py           # Modelos Pydantic (CurrentWeather, WeatherResponse)
│   │   └── services/
│   │       └── weather_service.py   # Consumo assíncrono da API Open-Meteo e cálculo de risco
│   ├── requirements.txt             # Dependências Python (fastapi, uvicorn, httpx, pydantic)
│   └── README.md
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MapView.jsx          # Componente do mapa Leaflet
│   │   │   ├── AlertMarker.jsx      # Marcadores customizados com SVG e pulso crítico
│   │   │   ├── AlertModal.jsx       # Modal para registrar novo alerta no Firestore
│   │   │   ├── WeatherCard.jsx      # Card meteorológico e risco de enchente
│   │   │   ├── Navbar.jsx           # Cabeçalho com status da conexão e contador
│   │   │   └── Legend.jsx           # Legenda das categorias de incidentes
│   │   ├── services/
│   │   │   ├── firebase.js          # Inicialização Firebase e listener onSnapshot
│   │   │   └── weatherApi.js        # Integração HTTP com a API FastAPI
│   │   ├── App.jsx                  # Estado global e orquestração
│   │   ├── App.css
│   │   ├── index.css                # Estilização moderna em Glassmorphism
│   │   └── main.jsx
│   ├── package.json                 # Dependências React e Leaflet
│   ├── vite.config.js
│   ├── .env.example
│   └── README.md
└── README.md
```

---

##  Como Iniciar os Servidores Localmente

### 1. Terminal 1: Iniciar o Backend (FastAPI)

```bash
# 1. Navegue até o diretório do backend
cd backend

# 2. Crie e ative um ambiente virtual Python (recomendado)
python3 -m venv venv
source venv/bin/activate       # No Linux/macOS
# venv\Scripts\activate     # No Windows

# 3. Instale as dependências
pip install -r requirements.txt

# 4. Inicie o servidor FastAPI com hot-reload
uvicorn app.main:app --reload --port 8000
```
- A API estará disponível em: `http://localhost:8000`
- Documentação interativa Swagger: `http://localhost:8000/docs`

---

### 2. Terminal 2: Iniciar o Frontend (React + Vite)

```bash
# 1. Navegue até o diretório do frontend
cd frontend

# 2. Instale os pacotes npm
npm install

# 3. Inicie o servidor de desenvolvimento Vite
npm run dev
```
- A aplicação web abrirá em: `http://localhost:5173`

---

##  Configuração do Firebase Firestore

Para conectar seu próprio banco de dados Firebase:

1. Acesse o [Firebase Console](https://console.firebase.google.com/) e crie um projeto (ex: `aqua-alert-monitor`).
2. No menu lateral, acesse **Build > Firestore Database** e clique em **Criar Banco de Dados** (modo de teste para desenvolvimento).
3. Vá em **Configurações do Projeto** (ícone de engrenagem) > **Geral** > **Seus Aplicativos** e adicione um app Web (`</>`).
4. Copie as chaves do objeto `firebaseConfig`.
5. No diretório `frontend/`, crie um arquivo `.env` baseado no `.env.example`:
```bash
cp frontend/.env.example frontend/.env
```
6. Preencha as variáveis com suas credenciais do Firebase:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef
```

### Regras de Segurança do Firestore (Modo de Teste / Acadêmico):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /alertas/{document=**} {
      allow read, write: if true;
    }
  }
}
```

---

##  Endpoints da API (Backend FastAPI)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/` | Informações do projeto e status |
| `GET` | `/api/health` | Healthcheck do serviço |
| `GET` | `/api/weather?latitude={lat}&longitude={lon}` | Consulta a API Open-Meteo e calcula a probabilidade de chuva, volume acumulado em 24h e nível de risco |

### Exemplo de Resposta de `/api/weather`:
```json
{
  "latitude": -23.55052,
  "longitude": -46.633308,
  "timezone": "America/Sao_Paulo",
  "current": {
    "temperature": 24.2,
    "apparent_temperature": 25.1,
    "relative_humidity": 78,
    "precipitation": 2.4,
    "weather_code": 61,
    "weather_description": "Chuva fraca",
    "wind_speed": 12.5
  },
  "precipitation_probability_max_24h": 85,
  "total_precipitation_24h": 32.5,
  "risk_level": "ALTO",
  "risk_color": "#F97316",
  "risk_description": "Risco alto de alagamentos pontuais e enxurradas em vias públicas. Redobre a atenção em trajetos próximos a córregos.",
  "hourly_forecast": [
    {
      "time": "2026-08-26T14:00",
      "precipitation_probability": 85,
      "precipitation": 5.2
    }
  ]
}
```

---

##  Dica para Apresentação Acadêmica

Para demonstrar a sincronização em tempo real:
1. Abra duas janelas do navegador lado a lado em `http://localhost:5173`.
2. Na primeira janela, clique em qualquer ponto do mapa e registre um alerta (ex: "Enchente com água na altura do pneu").
3. Observe a segunda janela: o marcador colorido com ícone pulsante surgirá instantaneamente no mapa sem recarregar a página!
