import React, { useLayoutEffect, useRef } from 'react';
import Phaser from 'phaser';
import { gameConfig } from '../game/config/gameConfig';

export default function PhaserGame() {
  const containerRef = useRef(null);
  const gameRef = useRef(null);

  useLayoutEffect(() => {
    if (gameRef.current === null) {
      gameRef.current = new Phaser.Game({
        ...gameConfig,
        parent: containerRef.current
      });
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div 
      id="game-container" 
      ref={containerRef} 
      style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} 
    />
  );
}
