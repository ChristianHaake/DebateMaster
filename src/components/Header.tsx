import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header__brand">
        <span>DebateMaster</span>
        <span className="header__tagline">Zeitsteuerung und Visualisierung</span>
      </div>
      <div className="header__local-badge" title="Alle Daten bleiben auf diesem Gerät.">
        <ShieldCheck size={14} />
        <span>Lokal & Privat</span>
      </div>
    </header>
  );
};
