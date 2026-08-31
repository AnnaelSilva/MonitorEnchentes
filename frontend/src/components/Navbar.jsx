import React from 'react';
import { Waves, PlusCircle, Radio, ShieldAlert, CloudRain } from 'lucide-react';

export default function Navbar({ onOpenReportModal, totalAlerts, isFirebaseConnected, weatherSummary }) {
  return (
    <header style={{
      height: '64px',
      background: 'rgba(15, 23, 42, 0.95)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      zIndex: 1000,
      backdropFilter: 'blur(10px)'
    }}>
      {/* Brand & Project Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(37, 99, 235, 0.5)'
        }}>
          <Waves size={24} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#f8fafc' }}>
            AquaAlert <span style={{ fontSize: '0.75rem', fontWeight: 400, color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '2px 6px', borderRadius: '4px', marginLeft: '6px' }}>ACADÊMICO</span>
          </h1>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Monitoramento Climático & Alertas de Enchente em Tempo Real
          </p>
        </div>
      </div>

      {/* Center Status Indicators */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Real-time Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '6px 12px',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: '0.8rem'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isFirebaseConnected ? '#10b981' : '#f59e0b',
            display: 'inline-block',
            boxShadow: isFirebaseConnected ? '0 0 8px #10b981' : 'none'
          }} />
          <span style={{ color: '#cbd5e1' }}>
            {isFirebaseConnected ? 'Tempo Real Ativo' : 'Conectando Firestore...'}
          </span>
        </div>

        {/* Counter of active alerts */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.85rem',
          color: '#cbd5e1'
        }}>
          <ShieldAlert size={16} color="#ef4444" />
          <span>Alertas ativos: <strong>{totalAlerts}</strong></span>
        </div>
      </div>

      {/* Action Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          className="btn-primary"
          onClick={onOpenReportModal}
          title="Clique no mapa ou neste botão para registrar um incidente"
        >
          <PlusCircle size={18} />
          <span>Reportar Alerta</span>
        </button>
      </div>
    </header>
  );
}
