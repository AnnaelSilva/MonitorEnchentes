import React from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import AlertMarker from './AlertMarker';

// Componente utilitário para capturar cliques no mapa e movimento
function MapEventHandler({ onMapClick, onCenterChange }) {
  const map = useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick(e.latlng);
      }
    },
    moveend() {
      if (onCenterChange) {
        const center = map.getCenter();
        onCenterChange({ lat: center.lat, lng: center.lng });
      }
    }
  });
  return null;
}

export default function MapView({ alerts, onMapClick, onCenterChange, initialCenter = [-23.55052, -46.633308], zoom = 13 }) {
  return (
    <MapContainer
      center={initialCenter}
      zoom={zoom}
      scrollWheelZoom={true}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Camada de mapa OpenStreetMap com visualização detalhada */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapEventHandler onMapClick={onMapClick} onCenterChange={onCenterChange} />

      {/* Renderização em tempo real de todos os alertas ativos */}
      {alerts.map((alert) => (
        <AlertMarker key={alert.id} alert={alert} />
      ))}
    </MapContainer>
  );
}
