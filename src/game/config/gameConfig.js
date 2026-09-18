import Phaser from 'phaser';
import BootScene from '../scenes/BootScene';
import MainMenuScene from '../scenes/MainMenuScene';
import HowToPlayScene from '../scenes/HowToPlayScene';
import GameScene from '../scenes/GameScene';
import GameOverScene from '../scenes/GameOverScene';
import VictoryScene from '../scenes/VictoryScene';

export const gameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 1280,
  height: 720,
  backgroundColor: '#1a0933',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 320,
      height: 180
    },
    max: {
      width: 1920,
      height: 1080
    }
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
      debug: false
    }
  },
  scene: [
    BootScene,
    MainMenuScene,
    HowToPlayScene,
    GameScene,
    GameOverScene,
    VictoryScene
  ]
};

