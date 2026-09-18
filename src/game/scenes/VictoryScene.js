import Phaser from 'phaser';
import { EventBus } from '../EventBus';

export default class VictoryScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VictoryScene' });
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
    EventBus.emit('scene-changed', 'VictoryScene');

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const bg = this.add.graphics();
    bg.fillGradientStyle(0x3B0D40, 0x3B0D40, 0x882A00, 0x882A00, 1);
    bg.fillRect(0, 0, width, height);

    // Celebratory Victory Confetti Particle Emitter
    const confettiEmitter = this.add.particles(0, 0, 'confetti_particle', {
      x: { min: 0, max: width },
      y: 0,
      speedY: { min: 100, max: 300 },
      speedX: { min: -50, max: 50 },
      scale: { start: 1, end: 0.4 },
      lifespan: 3000,
      quantity: 3,
      frequency: 100
    });

    // Heading Texts
    this.add.text(width / 2, 110, 'VIGHNAS REMOVED!', {
      fontFamily: 'Cinzel, serif',
      fontSize: '56px',
      fontStyle: 'bold',
      color: '#FFD700',
      stroke: '#4a0e2e',
      strokeThickness: 8,
      shadow: { blur: 20, color: '#FFAA00', fill: true }
    }).setOrigin(0.5);

    this.add.text(width / 2, 175, '🪔 GANPATI BAPPA MORYA! 🪔', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '26px',
      color: '#FFAA00',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    if (this.isNewHighScore) {
      const badge = this.add.text(width / 2, 220, '🎉 NEW HIGH SCORE RECORD! 🎉', {
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

    // Performance Stats Card
    const box = this.add.graphics();
    box.fillStyle(0x000000, 0.5);
    box.fillRoundedRect(width / 2 - 250, 255, 500, 250, 16);
    box.lineStyle(2, 0xFFD700, 0.8);
    box.strokeRoundedRect(width / 2 - 250, 255, 500, 250, 16);

    this.add.text(width / 2, 290, `Final Score: ${this.finalScore.toLocaleString()}`, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '28px',
      color: '#FFD700',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, 335, `🪔 Modaks Collected: ${this.finalModaks}`, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '20px',
      color: '#FFFFFF'
    }).setOrigin(0.5);

    this.add.text(width / 2, 375, `🔥 Highest Combo: x${this.highestCombo}`, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '20px',
      color: '#FF9900',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, 415, `🏆 Waves Completed: 6 / 6 (Maha Vighna Cleared)`, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '19px',
      color: '#00E676',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, 455, `👑 Best High Score: ${this.highScore.toLocaleString()}`, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '20px',
      color: '#FFAA00'
    }).setOrigin(0.5);

    // TWO BUTTONS: PLAY AGAIN & MAIN MENU

    // 1. PLAY AGAIN BUTTON
    const playAgainBtn = this.add.container(width / 2 - 140, 555);
    const btnBg = this.add.graphics();
    btnBg.fillStyle(0xFF6600, 1);
    btnBg.fillRoundedRect(-110, -26, 220, 52, 26);
    btnBg.lineStyle(3, 0xFFD700, 1);
    btnBg.strokeRoundedRect(-110, -26, 220, 52, 26);

    const btnText = this.add.text(0, 0, 'PLAY AGAIN 🪔', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '20px',
      color: '#FFFFFF',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    playAgainBtn.add([btnBg, btnText]);
    playAgainBtn.setSize(220, 52);
    playAgainBtn.setInteractive({ useHandCursor: true });
    playAgainBtn.on('pointerdown', () => this.restartGame());

    // 2. MAIN MENU BUTTON
    const menuBtn = this.add.container(width / 2 + 140, 555);
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

