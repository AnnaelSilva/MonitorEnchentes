import React, { useState } from 'react';
import { Layers, ChevronUp, ChevronDown } from 'lucide-react';

export default function Legend() {
  const [isOpen, setIsOpen] = useState(false);

  const legendItems = [
    { label: 'Enchente / Inundação', color: '#ef4444' },
    { label: 'Ponto de Alagamento', color: '#f59e0b' },
    { label: 'Via Bloqueada', color: '#dc2626' },
    { label: 'Risco de Deslizamento', color: '#ea580c' },
    { label: 'Rio Transbordando', color: '#3b82f6' }
  ];

  return (
    <div className="glass-panel" style={{
      position: 'absolute',
      bottom: '20px',
      left: '20px',
      zIndex: 1000,
      padding: '10px 14px',
      fontSize: '0.8rem'
    }}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          color: '#cbd5e1',
          fontWeight: 600
        }}
      >
        <Layers size={16} color="#38bdf8" />
        <span>Legenda de Incidentes</span>
        {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </div>

      {isOpen && (
        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {legendItems.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: item.color,
                display: 'inline-block'
              }} />
              <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{item.label}</span>
            </div>
          ))}
          <div style={{ marginTop: '4px', paddingTop: '6px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '0.7rem', color: '#64748b' }}>
            💡 Dica: Clique no mapa para marcar uma ocorrência.
          </div>
        </div>
      )}
    </div>
  );
}
