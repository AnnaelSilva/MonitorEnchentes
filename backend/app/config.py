from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Monitor de Enchentes e Clima API"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "API para consulta meteorológica via Open-Meteo e apoio ao monitoramento de enchentes"
    
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    OPEN_METEO_BASE_URL: str = "https://api.open-meteo.com/v1/forecast"

    class Config:
        case_sensitive = True

settings = Settings()
