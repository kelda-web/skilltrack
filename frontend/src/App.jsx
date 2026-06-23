import Dashboard from './pages/Dashboard';
import Assessment from './pages/Assessment';
import Roadmap from './pages/Roadmap';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import SkillSelection from './pages/SkillSelection';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/skills" element={<SkillSelection />} />
        <Route path="/roadmap/:skillId" element={<Roadmap />} />
        <Route path="/assessment/:skillId" element={<Assessment />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;