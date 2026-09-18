import React, { useState } from 'react';
import { EventBus } from '../game/EventBus';

export default function TouchControls() {
  const [activeLeft, setActiveLeft] = useState(false);
  const [activeRight, setActiveRight] = useState(false);

  const handleLeftStart = (e) => {
    e.preventDefault();
    setActiveLeft(true);
    EventBus.emit('touch-move-left', true);
  };

  const handleLeftEnd = (e) => {
    e.preventDefault();
    setActiveLeft(false);
    EventBus.emit('touch-move-left', false);
  };

  const handleRightStart = (e) => {
    e.preventDefault();
    setActiveRight(true);
    EventBus.emit('touch-move-right', true);
  };

  const handleRightEnd = (e) => {
    e.preventDefault();
    setActiveRight(false);
    EventBus.emit('touch-move-right', false);
  };

  const handleJump = (e) => {
    e.preventDefault();
    EventBus.emit('touch-jump');
  };

  const handleTrunkBlast = (e) => {
    e.preventDefault();
    EventBus.emit('touch-attack-e');
  };

  const handleVakratunda = (e) => {
    e.preventDefault();
    EventBus.emit('touch-attack-q');
  };

  return (
    <div className="touch-controls-overlay">
      {/* Bottom Left Movement D-Pad */}
      <div className="touch-dpad">
        <button 
          className={`touch-btn dpad-btn ${activeLeft ? 'active' : ''}`}
          onTouchStart={handleLeftStart}
          onTouchEnd={handleLeftEnd}
          onMouseDown={handleLeftStart}
          onMouseUp={handleLeftEnd}
        >
          ◀
        </button>

        <button 
          className={`touch-btn dpad-btn ${activeRight ? 'active' : ''}`}
          onTouchStart={handleRightStart}
          onTouchEnd={handleRightEnd}
          onMouseDown={handleRightStart}
          onMouseUp={handleRightEnd}
        >
          ▶
        </button>
      </div>

      {/* Bottom Right Skill & Jump Action Cluster */}
      <div className="touch-actions">
        <button 
          className="touch-btn action-btn trunk-btn"
          onTouchStart={handleTrunkBlast}
          onMouseDown={handleTrunkBlast}
        >
          🐘
        </button>

        <button 
          className="touch-btn action-btn vakratunda-btn"
          onTouchStart={handleVakratunda}
          onMouseDown={handleVakratunda}
        >
          🔱
        </button>

        <button 
          className="touch-btn action-btn jump-btn"
          onTouchStart={handleJump}
          onMouseDown={handleJump}
        >
          ▲
        </button>
      </div>
    </div>
  );
}
