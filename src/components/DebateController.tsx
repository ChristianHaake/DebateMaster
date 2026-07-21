import React, { useEffect, useState } from 'react';
import { useDebateStore, type Participant } from '../store/useDebateStore';
import { Play, Pause, Square, PlusCircle, MinusCircle } from 'lucide-react';
import './DebateController.css';

const formatTime = (ms: number) => {
  const sign = ms < 0 ? '-' : '';
  const absMs = Math.abs(ms);
  const totalSeconds = Math.floor(absMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${sign}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const DebateController: React.FC = () => {
  const { participants, activeParticipantId, activeSessionStart, timeLimitMs, switchSpeaker, toggleTimer, addSpeakingTime } = useDebateStore();
  const [localDisplayTime, setLocalDisplayTime] = useState(0);

  useEffect(() => {
    let interval: number;
    if (activeSessionStart) {
      interval = window.setInterval(() => {
        setLocalDisplayTime(Date.now() - activeSessionStart);
      }, 100);
    } else {
      setLocalDisplayTime(0);
    }
    return () => clearInterval(interval);
  }, [activeSessionStart]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        toggleTimer();
      } else if (e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key) - 1;
        if (index < participants.length) {
          switchSpeaker(participants[index].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [participants, toggleTimer, switchSpeaker]);

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
  
  const getDisplayMs = (p: Participant) => {
    let ms = p.speakingTimeMs;
    if (activeParticipantId === p.id && activeSessionStart) {
      ms += localDisplayTime;
    }
    return ms;
  };

  if (participants.length === 0) return null;

  const activeParticipant = participants.find(p => p.id === activeParticipantId);

  return (
    <section className="debate-controller">
      <h2>Debatte</h2>
      
      {activeParticipant && (
        <div className="focus-container">
          {(() => {
            const p = activeParticipant;
            const ms = getDisplayMs(p);
            const isOvertime = timeLimitMs > 0 && ms >= timeLimitMs;
            const displayTime = timeLimitMs > 0 ? timeLimitMs - ms : ms;
            
            return (
              <div className={`focus-card ${activeSessionStart ? 'focus-card--active' : 'focus-card--paused'} ${isOvertime ? 'timer--overtime' : ''}`}>
                <div className="focus-card__info">
                  <span className="focus-card__name">{p.name}</span>
                  <span className="focus-card__time">{formatTime(displayTime)}</span>
                </div>
                
                <div className="focus-card__actions">
                  <button className="btn-icon" onClick={(e) => { e.stopPropagation(); addSpeakingTime(p.id, -10000); }} aria-label="-10 Sekunden" title="-10 Sekunden abziehen">
                    <MinusCircle size={28} />
                  </button>
                  <button className="focus-card__main-action" onClick={() => toggleTimer()} aria-label="Toggle Timer">
                    {activeSessionStart ? <Pause size={56} /> : <Play size={56} />}
                  </button>
                  <button className="btn-icon" onClick={(e) => { e.stopPropagation(); addSpeakingTime(p.id, 10000); }} aria-label="+10 Sekunden" title="+10 Sekunden hinzufügen">
                    <PlusCircle size={28} />
                  </button>
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <button className="btn-secondary" onClick={stopDebate}>
                    <Square size={18} />
                    <span>Redner stoppen</span>
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      <div className="speaker-grid">
        {participants.map(p => {
          const isActive = activeParticipantId === p.id;
          const statusClass = isActive
            ? (activeSessionStart ? 'speaker-card--active' : 'speaker-card--paused')
            : '';

          const ms = getDisplayMs(p);
          const isOvertime = timeLimitMs > 0 && ms >= timeLimitMs;
          const displayTime = timeLimitMs > 0 ? timeLimitMs - ms : ms;

          return (
            <button
              key={p.id}
              className={`speaker-card ${statusClass} ${isOvertime && !isActive ? 'speaker-card--overtime' : ''}`}
              onClick={() => handleSpeakerClick(p)}
              aria-label={`${p.name} Redezeit steuern`}
            >
              <span className="speaker-card__name">{p.name}</span>
              <span className={`speaker-card__time ${isOvertime ? 'timer--overtime-text' : ''}`}>{formatTime(displayTime)}</span>
              {isActive && (
                <div style={{ marginTop: '0.25rem', color: activeSessionStart ? 'var(--primary)' : 'var(--warning)' }}>
                  {activeSessionStart ? <Pause size={32} /> : <Play size={32} />}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};
