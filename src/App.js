import { Routes, Route, Navigate } from 'react-router-dom';
import LuggageChecker from './pages/LuggageChecker';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/luggage-checker" element={<LuggageChecker />} />
        <Route path="/" element={<Navigate to="/luggage-checker" replace />} />
      </Routes>
    </div>
  );
}

export default App;