import React, { useState } from 'react';
import { useDebateStore } from '../store/useDebateStore';
import { Trash2, UserPlus } from 'lucide-react';
import './ParticipantManager.css';

export const ParticipantManager: React.FC = () => {
  const { participants, addParticipant, removeParticipant } = useDebateStore();
  const [newName, setNewName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      addParticipant(newName.trim());
      setNewName('');
    }
  };

  return (
    <section className="participant-manager">
      <h2>Teilnehmer</h2>
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
        <ul className="participant-list">
          {participants.map((p) => (
            <li key={p.id} className="participant-item">
              <span className="participant-item__name">{p.name}</span>
              <button
                className="btn-icon"
                onClick={() => removeParticipant(p.id)}
                aria-label={`${p.name} entfernen`}
                title="Entfernen"
              >
                <Trash2 size={18} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Noch keine Teilnehmer hinzugefügt.
        </p>
      )}
    </section>
  );
};
