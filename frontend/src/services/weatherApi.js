const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:8000';

/**
 * Consulta a previsão meteorológica e índice de risco de enchente no backend FastAPI.
 *
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<Object>} Dados estruturados da resposta
 */
export async function fetchWeather(latitude, longitude) {
  const response = await fetch(
    `${BACKEND_URL}/api/weather?latitude=${latitude}&longitude=${longitude}`
  );
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Erro na requisição meteorológica: ${response.status}`);
  }
  
  return await response.json();
}
