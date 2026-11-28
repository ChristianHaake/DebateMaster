import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ParticipantManager } from './components/ParticipantManager';
import { DebateController } from './components/DebateController';
import { Analytics } from './components/Analytics';
import { SupportPage } from './components/SupportPage';

function App() {
  const isSupportPage = window.location.pathname.replace(/\/$/, '') === '/unterstuetzung';

  return (
    <>
      <Header />
      {isSupportPage ? <SupportPage /> : (
        <main>
          <DebateController />
          <ParticipantManager />
          <Analytics />
        </main>
      )}
      <Footer />
    </>
  );
}

export default App;
