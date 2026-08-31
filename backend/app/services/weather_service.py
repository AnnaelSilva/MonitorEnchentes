import httpx
from fastapi import HTTPException
from app.config import settings
from app.schemas.weather import WeatherResponse, CurrentWeather, HourlyForecastItem

WMO_CODE_MAP = {
    0: "Céu limpo",
    1: "Predominantemente limpo",
    2: "Parcialmente nublado",
    3: "Encoberto",
    45: "Neblina",
    48: "Nevoeiro com geada",
    51: "Garoa leve",
    53: "Garoa moderada",
    55: "Garoa intensa",
    56: "Garoa congelante leve",
    57: "Garoa congelante densa",
    61: "Chuva fraca",
    63: "Chuva moderada",
    65: "Chuva forte",
    66: "Chuva congelante fraca",
    67: "Chuva congelante intensa",
    71: "Neve fraca",
    73: "Neve moderada",
    75: "Neve intensa",
    77: "Grãos de neve",
    80: "Pancadas de chuva leves",
    81: "Pancadas de chuva moderadas",
    82: "Pancadas de chuva violentas",
    85: "Pancadas de neve leves",
    86: "Pancadas de neve pesadas",
    95: "Tempestade com trovoadas",
    96: "Tempestade com granizo leve",
    99: "Tempestade com granizo forte"
}

def evaluate_flood_risk(total_precip_24h: float, max_prob: int) -> tuple[str, str, str]:
    if total_precip_24h >= 50.0 or (total_precip_24h >= 35.0 and max_prob >= 80):
        return (
            "CRÍTICO",
            "#EF4444",
            "Risco severo de inundações graves, transbordamento de rios e deslizamento de encostas. Evite áreas de várzea e siga as orientações da Defesa Civil."
        )
    elif total_precip_24h >= 25.0 or (total_precip_24h >= 15.0 and max_prob >= 70):
        return (
            "ALTO",
            "#F97316",
            "Risco alto de alagamentos pontuais e enxurradas em vias públicas. Redobre a atenção em trajetos próximos a córregos."
        )
    elif total_precip_24h >= 10.0 or max_prob >= 50:
        return (
            "MODERADO",
            "#EAB308",
            "Possibilidade de acúmulo de água em vias urbanas e tráfego lento. Mantenha-se atento às condições do tempo."
        )
    else:
        return (
            "BAIXO",
            "#10B981",
            "Baixo volume de chuva previsto. Condições meteorológicas com baixo potencial para alagamentos expressivos."
        )

async def get_weather_forecast(latitude: float, longitude: float) -> WeatherResponse:
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m",
        "hourly": "precipitation_probability,precipitation",
        "forecast_days": 2,
        "timezone": "auto"
    }
    
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.get(settings.OPEN_METEO_BASE_URL, params=params)
            response.raise_for_status()
            data = response.json()
        except httpx.HTTPStatusError as exc:
            raise HTTPException(
                status_code=exc.response.status_code,
                detail=f"Falha ao consultar API Open-Meteo: {exc.response.text}"
            )
        except Exception as exc:
            raise HTTPException(
                status_code=502,
                detail=f"Erro de conexão com o serviço meteorológico Open-Meteo: {str(exc)}"
            )
            
    current_data = data.get("current", {})
    hourly_data = data.get("hourly", {})
    
    weather_code = current_data.get("weather_code", 0)
    weather_desc = WMO_CODE_MAP.get(weather_code, "Condições variáveis")
    
    current = CurrentWeather(
        temperature=float(current_data.get("temperature_2m", 0.0)),
        apparent_temperature=float(current_data.get("apparent_temperature", 0.0)),
        relative_humidity=int(current_data.get("relative_humidity_2m", 0)),
        precipitation=float(current_data.get("precipitation", 0.0)),
        weather_code=weather_code,
        weather_description=weather_desc,
        wind_speed=float(current_data.get("wind_speed_10m", 0.0))
    )
    
    hourly_times = hourly_data.get("time", [])
    hourly_probs = hourly_data.get("precipitation_probability", [])
    hourly_precip = hourly_data.get("precipitation", [])
    
    # Próximas 24 horas
    next_24_probs = [p for p in hourly_probs[:24] if p is not None]
    next_24_precip = [p for p in hourly_precip[:24] if p is not None]
    
    max_prob_24h = max(next_24_probs) if next_24_probs else 0
    total_precip_24h = round(sum(next_24_precip), 1) if next_24_precip else 0.0
    
    risk_level, risk_color, risk_desc = evaluate_flood_risk(total_precip_24h, max_prob_24h)
    
    # Previsão das próximas 12 horas
    hourly_list = []
    limit = min(12, len(hourly_times))
    for i in range(limit):
        hourly_list.append(
            HourlyForecastItem(
                time=hourly_times[i],
                precipitation_probability=int(hourly_probs[i] or 0),
                precipitation=float(hourly_precip[i] or 0.0)
            )
        )
        
    return WeatherResponse(
        latitude=data.get("latitude", latitude),
        longitude=data.get("longitude", longitude),
        timezone=data.get("timezone", "UTC"),
        current=current,
        precipitation_probability_max_24h=max_prob_24h,
        total_precipitation_24h=total_precip_24h,
        risk_level=risk_level,
        risk_color=risk_color,
        risk_description=risk_desc,
        hourly_forecast=hourly_list
    )
