import React, { useState, useEffect } from 'react';
import { X, Send, AlertCircle, MapPin } from 'lucide-react';
import { createAlert } from '../services/firebase';

export default function AlertModal({ isOpen, onClose, defaultCoords, onSuccess }) {
  const [tipo, setTipo] = useState('enchente');
  const [severidade, setSeveridade] = useState('alta');
  const [descricao, setDescricao] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (defaultCoords) {
      setLatitude(defaultCoords.lat.toFixed(6));
      setLongitude(defaultCoords.lng.toFixed(6));
    }
  }, [defaultCoords]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!latitude || !longitude) {
      setError('Por favor, informe latitude e longitude válidas.');
      return;
    }

    if (!descricao.trim()) {
      setError('Por favor, informe uma breve descrição da ocorrência.');
      return;
    }

    setLoading(true);
    try {
      await createAlert({
        tipo,
        severidade,
        descricao: descricao.trim(),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      });

      setDescricao('');
      if (onSuccess) onSuccess('Alerta registrado e propagado em tempo real!');
      onClose();
    } catch (err) {
      console.error('Falha ao registrar alerta:', err);
      setError('Erro ao enviar alerta ao Firestore: ' + (err.message || 'Verifique sua conexão ou credenciais.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={22} color="#ef4444" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Reportar Incidente</h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            color: '#fca5a5',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Tipo de Alerta */}
          <div>
            <label style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Tipo de Ocorrência
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#f8fafc',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            >
              <option value="enchente" style={{ background: '#0f172a' }}>🌊 Enchente / Inundação</option>
              <option value="alagamento" style={{ background: '#0f172a' }}>🌧️ Ponto de Alagamento</option>
              <option value="via_bloqueada" style={{ background: '#0f172a' }}>🚫 Via Bloqueada / Intransitável</option>
              <option value="deslizamento" style={{ background: '#0f172a' }}>⛰️ Risco de Deslizamento de Encosta</option>
              <option value="rio_transbordando" style={{ background: '#0f172a' }}>〰️ Rio ou Córrego Transbordando</option>
            </select>
          </div>

          {/* Severidade */}
          <div>
            <label style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Nível de Severidade
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {[
                { id: 'baixa', label: 'Baixa', color: '#10b981' },
                { id: 'media', label: 'Média', color: '#f59e0b' },
                { id: 'alta', label: 'Alta', color: '#f97316' },
                { id: 'critica', label: 'Crítica', color: '#ef4444' }
              ].map((lvl) => (
                <button
                  type="button"
                  key={lvl.id}
                  onClick={() => setSeveridade(lvl.id)}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: severidade === lvl.id ? `2px solid ${lvl.color}` : '1px solid rgba(255, 255, 255, 0.1)',
                    background: severidade === lvl.id ? `${lvl.color}33` : 'rgba(255, 255, 255, 0.05)',
                    color: severidade === lvl.id ? '#ffffff' : '#94a3b8'
                  }}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Coordenadas */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="-23.5505"
                required
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#f8fafc',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="-46.6333"
                required
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#f8fafc',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Descrição do Local e Condição
            </label>
            <textarea
              rows={3}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Água atingindo a altura das calçadas na esquina da Av. Principal com Rua B..."
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#f8fafc',
                fontSize: '0.85rem',
                resize: 'none'
              }}
            />
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '0.5rem' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              <Send size={16} />
              <span>{loading ? 'Salvando...' : 'Publicar Alerta'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
