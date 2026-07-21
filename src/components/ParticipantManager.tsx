import React, { useState } from 'react';
import { useDebateStore } from '../store/useDebateStore';
import { Trash2, UserPlus, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';
import './ParticipantManager.css';

export const ParticipantManager: React.FC = () => {
  const { participants, timeLimitMs, addParticipant, removeParticipant, resetDebate, moveParticipant, updateParticipant, setTimeLimit } = useDebateStore();
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      addParticipant(newName.trim());
      setNewName('');
    }
  };

  const handleReset = () => {
    if (window.confirm('Möchten Sie die Debatte wirklich komplett zurücksetzen? Alle Teilnehmer und Zeiten werden gelöscht.')) {
      resetDebate();
    }
  };

  const startEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditName(name);
  };

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      updateParticipant(editingId, editName.trim());
    }
    setEditingId(null);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  return (
    <section className="participant-manager">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ margin: 0 }}>Einstellungen & Teilnehmer</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label htmlFor="timeLimit" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Zeitlimit:</label>
          <select 
            id="timeLimit"
            value={timeLimitMs} 
            onChange={(e) => setTimeLimit(Number(e.target.value))}
            style={{ padding: '0.375rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '0.875rem' }}
          >
            <option value={0}>Kein Limit</option>
            <option value={60000}>1 Minute</option>
            <option value={90000}>1,5 Minuten</option>
            <option value={120000}>2 Minuten</option>
            <option value={180000}>3 Minuten</option>
            <option value={300000}>5 Minuten</option>
          </select>
        </div>
      </div>
      
      <form className="participant-form" onSubmit={handleAdd}>
        <input
          type="text"
          className="participant-input"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Name des Teilnehmers"
          aria-label="Name des Teilnehmers"
        />
        <button type="submit" className="btn-primary" disabled={!newName.trim()}>
          <UserPlus size={18} />
          <span>Hinzufügen</span>
        </button>
      </form>

      {participants.length > 0 ? (
        <>
          <ul className="participant-list">
            {participants.map((p, index) => (
              <li key={p.id} className="participant-item">
                <div style={{ display: 'flex', gap: '0.25rem', marginRight: '0.5rem' }}>
                  <button type="button" className="btn-icon" onClick={() => moveParticipant(p.id, 'up')} disabled={index === 0} style={{ opacity: index === 0 ? 0.3 : 1 }} title="Nach oben">
                    <ArrowUp size={16} />
                  </button>
                  <button type="button" className="btn-icon" onClick={() => moveParticipant(p.id, 'down')} disabled={index === participants.length - 1} style={{ opacity: index === participants.length - 1 ? 0.3 : 1 }} title="Nach unten">
                    <ArrowDown size={16} />
                  </button>
                </div>
                
                {editingId === p.id ? (
                  <div style={{ flex: 1, display: 'flex' }}>
                    <input 
                      type="text" 
                      value={editName} 
                      onChange={e => setEditName(e.target.value)} 
                      onKeyDown={handleKeyDown}
                      onBlur={saveEdit}
                      autoFocus
                      style={{ flex: 1, padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid var(--primary)' }}
                    />
                  </div>
                ) : (
                  <span className="participant-item__name" style={{ flex: 1, cursor: 'text' }} onClick={() => startEdit(p.id, p.name)} title="Klicken zum Bearbeiten">
                    {p.name}
                  </span>
                )}
                
                <button
                  className="btn-icon"
                  onClick={() => removeParticipant(p.id)}
                  aria-label={`${p.name} entfernen`}
                  title="Entfernen"
                  style={{ marginLeft: '0.5rem' }}
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
            <button className="btn-secondary" onClick={handleReset} style={{ color: 'var(--danger)', borderColor: 'var(--danger-soft)' }}>
              <AlertTriangle size={18} />
              <span>Debatte zurücksetzen</span>
            </button>
          </div>
        </>
      ) : (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Noch keine Teilnehmer hinzugefügt.
        </p>
      )}
    </section>
  );
};
