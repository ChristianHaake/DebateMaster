import React, { useEffect } from 'react';
import { useDebateStore, type Participant } from '../store/useDebateStore';
import { Play, Pause, Square } from 'lucide-react';
import './DebateController.css';

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const DebateController: React.FC = () => {
  const { participants, activeParticipantId, isTimerRunning, switchSpeaker, toggleTimer, tickTimer } = useDebateStore();

  useEffect(() => {
    let interval: number;
    if (isTimerRunning) {
      interval = window.setInterval(() => {
        tickTimer(100);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, tickTimer]);

  const handleSpeakerClick = (p: Participant) => {
    if (activeParticipantId === p.id) {
      toggleTimer();
    } else {
      switchSpeaker(p.id);
    }
  };

  const stopDebate = () => {
    switchSpeaker(null);
  };

  if (participants.length === 0) return null;

  return (
    <section className="debate-controller">
      <h2>Debatte</h2>
      <div className="speaker-grid">
        {participants.map(p => {
          const isActive = activeParticipantId === p.id;
          const statusClass = isActive
            ? (isTimerRunning ? 'speaker-card--active' : 'speaker-card--paused')
            : '';

          return (
            <button
              key={p.id}
              className={`speaker-card ${statusClass}`}
              onClick={() => handleSpeakerClick(p)}
              aria-label={`${p.name} Redezeit steuern`}
            >
              <span className="speaker-card__name">{p.name}</span>
              <span className="speaker-card__time">{formatTime(p.speakingTimeMs)}</span>
              {isActive && (
                <div style={{ marginTop: '0.25rem', color: isTimerRunning ? 'var(--primary)' : 'var(--warning)' }}>
                  {isTimerRunning ? <Pause size={20} /> : <Play size={20} />}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {activeParticipantId && (
        <div className="controller-actions">
          <button className="btn-secondary" onClick={stopDebate}>
            <Square size={18} />
            <span>Debatte stoppen</span>
          </button>
        </div>
      )}
    </section>
  );
};
