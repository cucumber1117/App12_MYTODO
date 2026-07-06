import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import Todo from './pages/Todo/Todo.jsx';
import Setting from './pages/Setting/Setting.jsx';
import Footer from './component/Footer/Footer.jsx';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/todo" element={<Todo/>}/>
        <Route path="/setting" element={<Setting/>}/>
      </Routes>
      <Footer />
    </>
  );
}

export default App;