import Phaser from 'phaser';
import { EventBus } from '../EventBus';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data) {
    this.finalScore = data.score || 0;
    this.highScore = data.highScore || this.finalScore;
    this.isNewHighScore = data.isNewHighScore || false;
    this.finalModaks = data.modaks || 0;
    this.vighnasRemoved = data.vighnasRemoved || 0;
    this.highestCombo = data.highestCombo || 1;
  }

  create() {
    EventBus.emit('scene-changed', 'GameOverScene');

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1B020E, 0x1B020E, 0x3d0618, 0x3d0618, 1);
    bg.fillRect(0, 0, width, height);

    // Title
    this.add.text(width / 2, 130, 'GAME OVER', {
      fontFamily: 'Cinzel, serif',
      fontSize: '56px',
      fontStyle: 'bold',
      color: '#FF2244',
      stroke: '#000000',
      strokeThickness: 8
    }).setOrigin(0.5);

    this.add.text(width / 2, 190, 'The Vighnas have temporarily disturbed the festival.', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '20px',
      color: '#FFAAAA'
    }).setOrigin(0.5);

    if (this.isNewHighScore) {
      const badge = this.add.text(width / 2, 230, '🎉 NEW HIGH SCORE RECORD! 🎉', {
        fontFamily: 'Outfit, sans-serif',
        fontSize: '22px',
        color: '#FFD700',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4
      }).setOrigin(0.5);

      this.tweens.add({
        targets: badge,
        scaleX: 1.08,
        scaleY: 1.08,
        duration: 500,
        yoyo: true,
        repeat: -1
      });
    }

    // Detailed Stats Card
    const box = this.add.graphics();
    box.fillStyle(0x000000, 0.5);
    box.fillRoundedRect(width / 2 - 250, 265, 500, 240, 16);
    box.lineStyle(2, 0xFF2244, 0.6);
    box.strokeRoundedRect(width / 2 - 250, 265, 500, 240, 16);

    this.add.text(width / 2, 300, `Final Score: ${this.finalScore.toLocaleString()}`, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '28px',
      color: '#FFD700',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, 345, `👹 Vighnas Removed: ${this.vighnasRemoved}`, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '20px',
      color: '#FFFFFF'
    }).setOrigin(0.5);

    this.add.text(width / 2, 385, `🪔 Modaks Collected: ${this.finalModaks}`, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '20px',
      color: '#FFFFFF'
    }).setOrigin(0.5);

    this.add.text(width / 2, 425, `🔥 Highest Combo: x${this.highestCombo}`, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '20px',
      color: '#FF9900',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, 465, `👑 Best High Score: ${this.highScore.toLocaleString()}`, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '20px',
      color: '#FFAA00'
    }).setOrigin(0.5);

    // TWO BUTTONS: PLAY AGAIN & MAIN MENU

    // 1. PLAY AGAIN BUTTON
    const retryBtn = this.add.container(width / 2 - 140, 560);
    const retryBg = this.add.graphics();
    retryBg.fillStyle(0xCC1133, 1);
    retryBg.fillRoundedRect(-110, -26, 220, 52, 26);
    retryBg.lineStyle(3, 0xFFD700, 1);
    retryBg.strokeRoundedRect(-110, -26, 220, 52, 26);

    const retryText = this.add.text(0, 0, 'PLAY AGAIN 🔄', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '20px',
      color: '#FFFFFF',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    retryBtn.add([retryBg, retryText]);
    retryBtn.setSize(220, 52);
    retryBtn.setInteractive({ useHandCursor: true });
    retryBtn.on('pointerdown', () => this.restartGame());

    // 2. MAIN MENU BUTTON
    const menuBtn = this.add.container(width / 2 + 140, 560);
    const menuBg = this.add.graphics();
    menuBg.fillStyle(0x4A154B, 0.9);
    menuBg.fillRoundedRect(-110, -26, 220, 52, 26);
    menuBg.lineStyle(2, 0xFFD700, 0.8);
    menuBg.strokeRoundedRect(-110, -26, 220, 52, 26);

    const menuText = this.add.text(0, 0, 'MAIN MENU 🏠', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '20px',
      color: '#FFD700',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    menuBtn.add([menuBg, menuText]);
    menuBtn.setSize(220, 52);
    menuBtn.setInteractive({ useHandCursor: true });
    menuBtn.on('pointerdown', () => this.openMainMenu());

    const onSpace = () => this.restartGame();
    const onEnter = () => this.restartGame();

    this.input.keyboard.once('keydown-SPACE', onSpace);
    this.input.keyboard.once('keydown-ENTER', onEnter);

    this.events.once('shutdown', () => {
      this.input.keyboard.off('keydown-SPACE', onSpace);
      this.input.keyboard.off('keydown-ENTER', onEnter);
    });
  }

  restartGame() {
    this.scene.start('GameScene');
  }

  openMainMenu() {
    this.scene.start('MainMenuScene');
  }
}

