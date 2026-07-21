import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ParticipantManager } from './components/ParticipantManager';
import { DebateController } from './components/DebateController';
import { Analytics } from './components/Analytics';

function App() {
  return (
    <>
      <Header />
      <main>
        <DebateController />
        <ParticipantManager />
        <Analytics />
      </main>
      <Footer />
    </>
  );
}

export default App;
