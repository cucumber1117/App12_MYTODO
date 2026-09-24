import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { readPeriodSettings, PERIOD_SETTINGS_KEY } from './periodSettings.js';
import Home from './pages/Home/Home.jsx';
import Setting from './pages/Setting/Setting.jsx';
import Footer from './component/Footer/Footer.jsx';

function App() {
  const [periodSettings, setPeriodSettings] = useState(readPeriodSettings);

  const updatePeriodSettings = (settings) => {
    localStorage.setItem(PERIOD_SETTINGS_KEY, JSON.stringify(settings));
    setPeriodSettings(settings);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Home periodSettings={periodSettings} />} />
        <Route path="/todo" element={<Navigate to="/" replace />} />
        <Route path="/setting" element={<Setting periodSettings={periodSettings} onPeriodSettingsChange={updatePeriodSettings} />}/>
      </Routes>
      <Footer />
    </>
  );
}

export default App;
