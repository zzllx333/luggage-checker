import { Routes, Route, Navigate } from 'react-router-dom';
import LuggageChecker from './pages/LuggageChecker';
import PhotoCapture from './pages/PhotoCapture';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/luggage-checker" element={<LuggageChecker />} />
        <Route path="/luggage-checker/photo" element={<PhotoCapture />} />
        <Route path="/" element={<Navigate to="/luggage-checker" replace />} />
      </Routes>
    </div>
  );
}

export default App;