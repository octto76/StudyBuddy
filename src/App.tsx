import './App.css'
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import SwipePage from './pages/SwipePage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div style={{ padding: 20 }}>
            <h1>StudyBuddy</h1>
            <Link to="/swipe">Start swiping →</Link>
          </div>
        }
      />
      <Route path="/swipe" element={<SwipePage />} />
    </Routes>
  );
};

export default App
