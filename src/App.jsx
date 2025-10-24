import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import QuestGeneratorPage from './pages/QuestGeneratorPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/questgenerator" element={<QuestGeneratorPage />} />
      </Routes>
    </Router>
  );
}

export default App;