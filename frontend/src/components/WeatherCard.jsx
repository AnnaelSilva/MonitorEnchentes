import React, { useState } from 'react';
import { 
  CloudRain, 
  Droplets, 
  Wind, 
  Thermometer, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw,
  Clock
} from 'lucide-react';

export default function WeatherCard({ weatherData, loading, error, onRefresh }) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (loading) {
    return (
      <div className="glass-panel" style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 1000,
        padding: '16px 20px',
        width: '320px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <RefreshCw size={20} className="animate-spin" color="#38bdf8" />
        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
          Consultando dados Open-Meteo...
        </span>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className="glass-panel" style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 1000,
        padding: '14px 18px',
        width: '320px',
        borderLeft: '4px solid #ef4444'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.85rem', color: '#f87171' }}>Previsão indisponível</span>
          <button onClick={onRefresh} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <RefreshCw size={14} />
          </button>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
          Verifique se o backend FastAPI está em execução na porta 8000.
        </p>
      </div>
    );
  }

  const { current, precipitation_probability_max_24h, total_precipitation_24h, risk_level, risk_color, risk_description, hourly_forecast } = weatherData;

  return (
    <div className="glass-panel" style={{
      position: 'absolute',
      top: '20px',
      left: '20px',
      zIndex: 1000,
      width: '340px',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    }}>
      {/* Header com Diagnóstico de Risco */}
      <div style={{
        padding: '12px 16px',
        background: `linear-gradient(90deg, ${risk_color}22, rgba(15, 23, 42, 0.4))`,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            background: risk_color,
            color: '#ffffff',
            padding: '2px 8px',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.05em'
          }}>
            RISCO {risk_level}
          </span>
          <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 500 }}>
            Monitoramento 24h
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button 
            onClick={onRefresh} 
            title="Atualizar clima"
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
          >
            <RefreshCw size={14} />
          </button>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Main Indicators */}
      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>
              {current.temperature.toFixed(1)}°C
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
              {current.weather_description} (sensação {current.apparent_temperature.toFixed(1)}°C)
            </div>
          </div>
          
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(56, 189, 248, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CloudRain size={28} color="#38bdf8" />
          </div>
        </div>

        {/* Rain Probability and Precipitation Volume */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          marginBottom: '12px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Droplets size={12} color="#38bdf8" />
              <span>Chuva Prevista (24h)</span>
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8', marginTop: '2px' }}>
              {total_precipitation_24h} mm
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CloudRain size={12} color="#f59e0b" />
              <span>Probabilidade Máx.</span>
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f59e0b', marginTop: '2px' }}>
              {precipitation_probability_max_24h}%
            </div>
          </div>
        </div>

        {/* Risk Diagnosis Summary */}
        <p style={{
          fontSize: '0.75rem',
          color: '#cbd5e1',
          lineHeight: 1.4,
          background: 'rgba(0, 0, 0, 0.25)',
          padding: '8px 10px',
          borderRadius: '6px',
          borderLeft: `3px solid ${risk_color}`
        }}>
          {risk_description}
        </p>

        {/* Collapsible Hourly Forecast preview */}
        {isExpanded && hourly_forecast && hourly_forecast.length > 0 && (
          <div style={{ marginTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '10px' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} />
              <span>Previsão Pluviométrica Próximas Horas:</span>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {hourly_forecast.slice(0, 6).map((item, idx) => {
                const hour = new Date(item.time).getHours();
                return (
                  <div key={idx} style={{
                    minWidth: '45px',
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '6px 4px',
                    borderRadius: '6px',
                    fontSize: '0.7rem'
                  }}>
                    <div style={{ color: '#94a3b8' }}>{hour}h</div>
                    <div style={{ fontWeight: 600, color: item.precipitation_probability > 50 ? '#38bdf8' : '#cbd5e1', marginTop: '2px' }}>
                      {item.precipitation_probability}%
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#64748b' }}>
                      {item.precipitation}mm
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
