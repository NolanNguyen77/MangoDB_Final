import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { QRScanner } from './components/QRScanner';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';

type Screen = 'landing' | 'scanner' | 'login' | 'dashboard';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');

  return (
    <div className="min-h-screen">
      {currentScreen === 'landing' && (
        <LandingPage
          onSelectGuest={() => setCurrentScreen('scanner')}
          onSelectAdmin={() => setCurrentScreen('login')}
        />
      )}

      {currentScreen === 'scanner' && (
        <QRScanner onBack={() => setCurrentScreen('landing')} />
      )}

      {currentScreen === 'login' && (
        <AdminLogin
          onBack={() => setCurrentScreen('landing')}
          onLogin={() => setCurrentScreen('dashboard')}
        />
      )}

      {currentScreen === 'dashboard' && (
        <AdminDashboard onLogout={() => setCurrentScreen('landing')} />
      )}
    </div>
  );
}
