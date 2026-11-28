import { useEffect } from 'react';
import { Coffee } from 'lucide-react';

export function SupportPage() {

  const title = 'DebateMaster unterstützen';

  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    return () => {
      document.title = previousTitle;
    };
  }, [title]);

  return (
    <main className="support-page">
      <h1>{title}</h1>
      <p>Moderierst du Debatten mit DebateMaster? Ein freiwilliger Kaffee hilft mir, die Zeitsteuerung und die Auswertung der Redeanteile weiterzuentwickeln und zu testen. Alle Funktionen der App bleiben für alle kostenlos.</p>
      <a
        className="support-link"
        href="https://buymeacoffee.com/Haake"
        target="_blank"
        rel="noopener noreferrer"
        aria-describedby="support-privacy"
      >
        <Coffee size={18} aria-hidden="true" />
        Kaffee spendieren
      </a>
      <p id="support-privacy">Der Kaffeelink öffnet Buy Me a Coffee in einem neuen Tab. Der Anbieter erhält erst beim Öffnen des Links Verbindungsdaten. Ab dann gilt seine Datenschutzerklärung.</p>
      <h2>Kostenlos helfen</h2>
      <div className="support-page__links">
        <a
          href="https://haak3.atlassian.net/jira/software/form/69a50efc-0474-445e-8f01-66eb6b747cc1"
          target="_blank"
          rel="noopener noreferrer"
        >
          Fehler melden (Jira)
        </a>
        <a
          href="https://haak3.atlassian.net/jira/software/form/50d4fc51-bff4-4e21-b46e-8fd987b90d24"
          target="_blank"
          rel="noopener noreferrer"
        >
          Funktion vorschlagen (Jira)
        </a>
        <a href="mailto:apps@haak3.de?subject=DebateMaster%20Feedback">Feedback per E-Mail</a>
      </div>
      <a href="/" className="support-page__back">Zurück zur App</a>
    </main>
  );
}
