import Phaser from 'phaser';
import { EventBus } from '../EventBus';

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenuScene' });
  }

  create() {
    EventBus.emit('scene-changed', 'MainMenuScene');

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const savedHighScore = parseInt(localStorage.getItem('ganesha_high_score') || '0', 10);

    // Background Gradient Graphic
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x2B0938, 0x2B0938, 0x661840, 0x661840, 1);
    bg.fillRect(0, 0, width, height);

    this.drawGarlands(width);
    this.drawMandapPillars(width, height);

    // Title Text
    this.add.text(width / 2, 120, 'GANESHA VS VIGHNAS', {
      fontFamily: 'Cinzel, serif',
      fontSize: '56px',
      fontStyle: 'bold',
      color: '#FFD700',
      stroke: '#4a0e2e',
      strokeThickness: 8,
      shadow: { blur: 18, color: '#FF9900', fill: true }
    }).setOrigin(0.5);

    // Tagline Text
    this.add.text(width / 2, 185, '"Remove the obstacles. Restore the celebration."', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '22px',
      color: '#FFAA00',
      fontStyle: '600'
    }).setOrigin(0.5);

    // High Score Badge on Main Menu
    if (savedHighScore > 0) {
      this.add.text(width / 2, 230, `👑 BEST HIGH SCORE: ${savedHighScore.toLocaleString()}`, {
        fontFamily: 'Outfit, sans-serif',
        fontSize: '20px',
        color: '#FFD700',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 3
      }).setOrigin(0.5);
    }

    // Animated Ganesha Preview Sprite with Divine Aura
    const ganesha = this.add.image(width / 2, 335, 'ganesha_player').setScale(1.4);
    this.tweens.add({
      targets: ganesha,
      y: 325,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // === THREE ACTION BUTTONS: PLAY, HOW TO PLAY, CREDITS ===

    // 1. PLAY BUTTON
    const playBtn = this.add.container(width / 2, 450);
    const playBg = this.add.graphics();
    playBg.fillStyle(0xFF6600, 1);
    playBg.fillRoundedRect(-140, -28, 280, 56, 28);
    playBg.lineStyle(3, 0xFFD700, 1);
    playBg.strokeRoundedRect(-140, -28, 280, 56, 28);

    const playText = this.add.text(0, 0, 'PLAY 🪔', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '24px',
      color: '#FFFFFF',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    playBtn.add([playBg, playText]);
    playBtn.setSize(280, 56);
    playBtn.setInteractive({ useHandCursor: true });
    playBtn.on('pointerover', () => playBtn.setScale(1.08));
    playBtn.on('pointerout', () => playBtn.setScale(1));
    playBtn.on('pointerdown', () => this.startGame());

    // 2. HOW TO PLAY BUTTON
    const htpBtn = this.add.container(width / 2 - 140, 530);
    const htpBg = this.add.graphics();
    htpBg.fillStyle(0x4A154B, 0.9);
    htpBg.fillRoundedRect(-110, -24, 220, 48, 24);
    htpBg.lineStyle(2, 0xFFD700, 0.8);
    htpBg.strokeRoundedRect(-110, -24, 220, 48, 24);

    const htpText = this.add.text(0, 0, 'HOW TO PLAY 🎮', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '18px',
      color: '#FFD700',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    htpBtn.add([htpBg, htpText]);
    htpBtn.setSize(220, 48);
    htpBtn.setInteractive({ useHandCursor: true });
    htpBtn.on('pointerover', () => htpBtn.setScale(1.06));
    htpBtn.on('pointerout', () => htpBtn.setScale(1));
    htpBtn.on('pointerdown', () => {
      this.scene.start('HowToPlayScene');
    });

    // 3. CREDITS BUTTON
    const credBtn = this.add.container(width / 2 + 140, 530);
    const credBg = this.add.graphics();
    credBg.fillStyle(0x4A154B, 0.9);
    credBg.fillRoundedRect(-110, -24, 220, 48, 24);
    credBg.lineStyle(2, 0xFFD700, 0.8);
    credBg.strokeRoundedRect(-110, -24, 220, 48, 24);

    const credText = this.add.text(0, 0, 'CREDITS 🏆', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '18px',
      color: '#FFD700',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    credBtn.add([credBg, credText]);
    credBtn.setSize(220, 48);
    credBtn.setInteractive({ useHandCursor: true });
    credBtn.on('pointerover', () => credBtn.setScale(1.06));
    credBtn.on('pointerout', () => credBtn.setScale(1));
    credBtn.on('pointerdown', () => {
      EventBus.emit('open-modal', 'credits');
    });

    const onSpace = () => this.startGame();
    const onEnter = () => this.startGame();

    this.input.keyboard.once('keydown-SPACE', onSpace);
    this.input.keyboard.once('keydown-ENTER', onEnter);

    this.events.once('shutdown', () => {
      this.input.keyboard.off('keydown-SPACE', onSpace);
      this.input.keyboard.off('keydown-ENTER', onEnter);
    });
  }

  drawMandapPillars(width, height) {
    this.add.image(40, height / 2, 'mandap_arch').setDepth(2);
    this.add.image(width - 40, height / 2, 'mandap_arch').setFlipX(true).setDepth(2);
  }

  drawGarlands(width) {
    const garland = this.add.graphics();
    garland.fillStyle(0xFF9900, 1);
    for (let x = 0; x <= width; x += 30) {
      garland.fillCircle(x, 15 + Math.sin(x * 0.05) * 10, 8);
      garland.fillStyle(0xFFD700, 1);
      garland.fillCircle(x + 15, 20 + Math.sin((x + 15) * 0.05) * 10, 6);
      garland.fillStyle(0xFF9900, 1);
    }
  }

  startGame() {
    this.scene.start('GameScene');
  }
}
