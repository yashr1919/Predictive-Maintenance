import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ComponentDetail from './components/ComponentDetail';
import AiAssistant from './components/AiAssistant';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/component/:name" element={<ComponentDetail />} />
      </Routes>
      {/* Global AI Assistant Anchor */}
      <AiAssistant />
    </Router>
  );
}
