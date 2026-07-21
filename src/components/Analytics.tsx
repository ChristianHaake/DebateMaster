import React from 'react';
import { useDebateStore } from '../store/useDebateStore';
import { Download } from 'lucide-react';
import './Analytics.css';

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const Analytics: React.FC = () => {
  const { participants } = useDebateStore();

  if (participants.length === 0) return null;

  const maxTime = Math.max(...participants.map((p) => p.speakingTimeMs), 1000); // at least 1s

  const handleExport = () => {
    const exportData = participants.map(p => ({
      name: p.name,
      speakingTimeSeconds: Math.floor(p.speakingTimeMs / 1000)
    }));
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debatemaster-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="analytics-section">
      <h2>Auswertung</h2>
      <div className="analytics-chart">
        {participants.map(p => {
          const widthPercent = (p.speakingTimeMs / maxTime) * 100;
          return (
            <div key={p.id} className="chart-bar-container">
              <div className="chart-label" title={p.name}>{p.name}</div>
              <div className="chart-track">
                <div 
                  className="chart-fill" 
                  style={{ width: `${Math.max(widthPercent, 0)}%` }} 
                  aria-label={`${p.name} Redezeit Anteil`} 
                />
              </div>
              <div className="chart-value">{formatTime(p.speakingTimeMs)}</div>
            </div>
          );
        })}
      </div>
      <div className="analytics-actions">
        <button className="btn-secondary" onClick={handleExport}>
          <Download size={18} />
          <span>Als JSON exportieren</span>
        </button>
      </div>
    </section>
  );
};
