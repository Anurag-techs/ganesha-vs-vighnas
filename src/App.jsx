import React from 'react';
import PhaserGame from './components/PhaserGame';
import GameUI from './components/GameUI';
import './styles/App.css';

export default function App() {
  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="app-title">
          <span>🪔</span> GANESHA VS VIGHNAS
        </div>
        <div className="contest-badge">
          Ganesh Chaturthi Contest Edition
        </div>
      </header>

      <main className="game-viewport">
        <PhaserGame />
        <GameUI />
      </main>
    </div>
  );
}
