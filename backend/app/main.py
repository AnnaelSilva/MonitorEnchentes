from fastapi import FastAPI, Query, status
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.schemas.weather import WeatherResponse
from app.services.weather_service import get_weather_forecast

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION
)

# Configuração CORS para integração com o React
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", status_code=status.HTTP_200_OK, tags=["Status"])
async def root():
    return {
        "projeto": "Sistema de Monitoramento Climático e Alertas de Enchente",
        "status": "online",
        "versao": settings.VERSION,
        "docs": "/docs"
    }

@app.get("/api/health", status_code=status.HTTP_200_OK, tags=["Health"])
async def health():
    return {"status": "healthy", "backend": "FastAPI"}

@app.get(
    "/api/weather",
    response_model=WeatherResponse,
    status_code=status.HTTP_200_OK,
    summary="Consulta dados climáticos e índice de risco de enchente",
    tags=["Meteorologia"]
)
async def get_weather(
    latitude: float = Query(..., ge=-90.0, le=90.0, description="Latitude (-90 a 90)"),
    longitude: float = Query(..., ge=-180.0, le=180.0, description="Longitude (-180 a 180)")
):
    """
    Consulta a API pública do Open-Meteo para a coordenada informada
    e calcula a probabilidade e volume de chuva das próximas horas.
    """
    return await get_weather_forecast(latitude=latitude, longitude=longitude)
