import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import MapView from './components/MapView';
import WeatherCard from './components/WeatherCard';
import AlertModal from './components/AlertModal';
import Legend from './components/Legend';
import { subscribeToAlerts } from './services/firebase';
import { fetchWeather } from './services/weatherApi';
import { CheckCircle } from 'lucide-react';
import './App.css';

// Centro padrão inicial: Região Metropolitana de São Paulo / Brasil
const DEFAULT_CENTER = { lat: -23.55052, lng: -46.633308 };

export default function App() {
  const [alerts, setAlerts] = useState([]);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState(DEFAULT_CENTER);
  
  // Estado meteorológico do backend FastAPI (Open-Meteo)
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);
  
  // Notificação Toast
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4500);
  };

  // Carrega previsão meteorológica da coordenada central
  const loadWeather = useCallback(async (lat, lng) => {
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const data = await fetchWeather(lat, lng);
      setWeatherData(data);
    } catch (err) {
      console.warn('Backend FastAPI indisponível ou erro na API:', err.message);
      setWeatherError(err.message);
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  // 1. Sincronização em tempo real com Firebase Firestore
  useEffect(() => {
    const unsubscribe = subscribeToAlerts(
      (updatedAlerts) => {
        setAlerts(updatedAlerts);
        setIsFirebaseConnected(true);
      },
      (error) => {
        console.error('Erro de sincronização Firebase:', error);
        setIsFirebaseConnected(false);
      }
    );

    // Carrega clima inicial
    loadWeather(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng);

    return () => unsubscribe();
  }, [loadWeather]);

  // Captura clique no mapa para reportar alerta com coordenadas precisas
  const handleMapClick = (latlng) => {
    setSelectedCoords({ lat: latlng.lat, lng: latlng.lng });
    setIsModalOpen(true);
  };

  // Atualiza previsão meteorológica quando o mapa se move
  const handleCenterChange = (center) => {
    setSelectedCoords(center);
    loadWeather(center.lat, center.lng);
  };

  return (
    <div className="app-container">
      {/* Barra de Navegação Superior */}
      <Navbar
        onOpenReportModal={() => setIsModalOpen(true)}
        totalAlerts={alerts.length}
        isFirebaseConnected={isFirebaseConnected}
      />

      {/* Área Principal com Mapa e Painéis Flutuantes */}
      <main className="main-content">
        <MapView
          alerts={alerts}
          onMapClick={handleMapClick}
          onCenterChange={handleCenterChange}
          initialCenter={[DEFAULT_CENTER.lat, DEFAULT_CENTER.lng]}
          zoom={13}
        />

        {/* Painel de Clima e Risco de Chuva (Backend FastAPI / Open-Meteo) */}
        <WeatherCard
          weatherData={weatherData}
          loading={weatherLoading}
          error={weatherError}
          onRefresh={() => loadWeather(selectedCoords.lat, selectedCoords.lng)}
        />

        {/* Legenda de Tipos de Incidentes */}
        <Legend />
      </main>

      {/* Modal de Envio de Alerta Colaborativo */}
      <AlertModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultCoords={selectedCoords}
        onSuccess={showToast}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notice">
          <CheckCircle size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
