from pydantic import BaseModel, Field
from typing import List

class CurrentWeather(BaseModel):
    temperature: float = Field(..., description="Temperatura atual em graus Celsius")
    apparent_temperature: float = Field(..., description="Sensação térmica em graus Celsius")
    relative_humidity: int = Field(..., description="Umidade relativa do ar (%)")
    precipitation: float = Field(..., description="Volume de precipitação atual (mm)")
    weather_code: int = Field(..., description="Código meteorológico WMO")
    weather_description: str = Field(..., description="Descrição legível das condições climáticas")
    wind_speed: float = Field(..., description="Velocidade do vento em km/h")

class HourlyForecastItem(BaseModel):
    time: str = Field(..., description="Horário previsto (ISO format)")
    precipitation_probability: int = Field(..., description="Probabilidade de chuva (%)")
    precipitation: float = Field(..., description="Volume de chuva estimado (mm)")

class WeatherResponse(BaseModel):
    latitude: float
    longitude: float
    timezone: str
    current: CurrentWeather
    precipitation_probability_max_24h: int = Field(..., description="Probabilidade máxima de chuva nas próximas 24h (%)")
    total_precipitation_24h: float = Field(..., description="Volume total acumulado de chuva previsto para 24h (mm)")
    risk_level: str = Field(..., description="Nível de risco de enchente: BAIXO, MODERADO, ALTO, CRÍTICO")
    risk_color: str = Field(..., description="Cor hexadecimal associada ao risco")
    risk_description: str = Field(..., description="Recomendação e diagnóstico da situação")
    hourly_forecast: List[HourlyForecastItem] = Field(default_factory=list, description="Previsão hora a hora para as próximas 12 horas")
