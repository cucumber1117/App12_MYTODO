import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import Setting from './pages/Setting/Setting.jsx';
import Footer from './component/Footer/Footer.jsx';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/todo" element={<Navigate to="/" replace />} />
        <Route path="/setting" element={<Setting/>}/>
      </Routes>
      <Footer />
    </>
  );
}

export default App;
