import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { AlertTriangle, Droplets, Ban, Mountain, Clock, MapPin } from 'lucide-react';

const ALERT_CONFIG = {
  enchente: {
    label: 'Enchente / Inundação',
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.15)',
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`
  },
  alagamento: {
    label: 'Ponto de Alagamento',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.15)',
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`
  },
  via_bloqueada: {
    label: 'Via Bloqueada',
    color: '#dc2626',
    bg: 'rgba(220, 38, 38, 0.15)',
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 14.14 14.14"/></svg>`
  },
  deslizamento: {
    label: 'Risco de Deslizamento',
    color: '#ea580c',
    bg: 'rgba(234, 88, 12, 0.15)',
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>`
  },
  rio_transbordando: {
    label: 'Rio Transbordando',
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.15)',
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>`
  }
};

const SEVERITY_MAP = {
  baixa: { label: 'Baixa', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
  media: { label: 'Média', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
  alta: { label: 'Alta', color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)' },
  critica: { label: 'Crítica', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.25)' }
};

function createCustomIcon(tipo, severidade) {
  const config = ALERT_CONFIG[tipo] || ALERT_CONFIG.enchente;
  const isCritical = severidade === 'critica' || severidade === 'alta';

  const html = `
    <div class="marker-pin ${isCritical ? 'pulse-critical' : ''}" style="background: ${config.color};">
      ${config.iconSvg}
    </div>
  `;

  return L.divIcon({
    className: 'custom-div-icon',
    html: html,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -32]
  });
}

export default function AlertMarker({ alert }) {
  const config = ALERT_CONFIG[alert.tipo] || ALERT_CONFIG.enchente;
  const severityInfo = SEVERITY_MAP[alert.severidade] || SEVERITY_MAP.media;

  const formattedDate = alert.timestamp ? new Date(alert.timestamp).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }) : 'Recente';

  return (
    <Marker
      position={[alert.latitude, alert.longitude]}
      icon={createCustomIcon(alert.tipo, alert.severidade)}
    >
      <Popup>
        <div style={{ padding: '6px', minWidth: '220px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{
              background: config.bg,
              color: config.color,
              padding: '3px 8px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase'
            }}>
              {config.label}
            </span>
            
            <span style={{
              background: severityInfo.bg,
              color: severityInfo.color,
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '0.7rem',
              fontWeight: 600
            }}>
              {severityInfo.label}
            </span>
          </div>

          {/* Description */}
          <p style={{
            fontSize: '0.9rem',
            color: '#f8fafc',
            lineHeight: 1.4,
            marginBottom: '10px',
            fontWeight: 400
          }}>
            {alert.descricao || 'Sem descrição adicional.'}
          </p>

          {/* Metadata */}
          <div style={{
            fontSize: '0.75rem',
            color: '#94a3b8',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={12} />
              <span>Reportado em: {formattedDate}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={12} />
              <span>{alert.latitude.toFixed(5)}, {alert.longitude.toFixed(5)}</span>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
