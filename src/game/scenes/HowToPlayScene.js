import Phaser from 'phaser';
import { EventBus } from '../EventBus';

export default class HowToPlayScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HowToPlayScene' });
  }

  create() {
    EventBus.emit('scene-changed', 'HowToPlayScene');

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Background Gradient Graphic
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x2B0938, 0x2B0938, 0x551435, 0x551435, 1);
    bg.fillRect(0, 0, width, height);

    // Decorative Garlands & Arch
    this.drawGarlands(width);

    // Title
    this.add.text(width / 2, 75, '🎮 HOW TO PLAY', {
      fontFamily: 'Cinzel, serif',
      fontSize: '46px',
      fontStyle: 'bold',
      color: '#FFD700',
      stroke: '#4a0e2e',
      strokeThickness: 6,
      shadow: { blur: 14, color: '#FF9900', fill: true }
    }).setOrigin(0.5);

    this.add.text(width / 2, 125, 'Master Lord Ganesha\'s Divine Powers to Remove All Obstacles!', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '18px',
      color: '#FFAA00',
      fontStyle: '600'
    }).setOrigin(0.5);

    // Controls Grid Container Card
    const cardBg = this.add.graphics();
    cardBg.fillStyle(0x000000, 0.55);
    cardBg.fillRoundedRect(width / 2 - 420, 160, 840, 390, 16);
    cardBg.lineStyle(2, 0xFFD700, 0.7);
    cardBg.strokeRoundedRect(width / 2 - 420, 160, 840, 390, 16);

    // Control Items List
    const controls = [
      { label: 'MOVE', keys: 'A / D  or  ← / →', desc: 'Walk Left and Right through the Mandap' },
      { label: 'JUMP', keys: 'SPACE  or  W  or  ↑', desc: 'Leap onto elevated platforms' },
      { label: 'TRUNK BLAST', keys: 'E', desc: 'Short-range frontal wave (Knocks back Vighnas)' },
      { label: 'VAKRATUNDA STRIKE', keys: 'Q', desc: '360° Divine Shockwave (Costs 25 Divine Energy)' },
      { label: 'COLLECT', keys: '🍬 MODAKS', desc: 'Restores +50 Score & +15 Divine Energy' },
      { label: 'SURVIVE', keys: '👹 VIGHNAS', desc: 'Clear 5 Waves & defeat Maha Vighna Boss!' }
    ];

    let startY = 190;
    controls.forEach((item) => {
      const rowBg = this.add.graphics();
      rowBg.fillStyle(0x3B1040, 0.6);
      rowBg.fillRoundedRect(width / 2 - 390, startY - 14, 780, 48, 8);
      rowBg.lineStyle(1, 0xFF9900, 0.4);
      rowBg.strokeRoundedRect(width / 2 - 390, startY - 14, 780, 48, 8);

      // Action Title
      this.add.text(width / 2 - 370, startY, item.label, {
        fontFamily: 'Outfit, sans-serif',
        fontSize: '17px',
        color: '#FFD700',
        fontStyle: 'bold'
      }).setOrigin(0, 0.5);

      // Key Badge
      this.add.text(width / 2 - 90, startY, item.keys, {
        fontFamily: 'Outfit, sans-serif',
        fontSize: '17px',
        color: '#FFFFFF',
        fontStyle: 'bold'
      }).setOrigin(0, 0.5);

      // Description
      this.add.text(width / 2 + 360, startY, item.desc, {
        fontFamily: 'Outfit, sans-serif',
        fontSize: '14px',
        color: '#DDAAAA'
      }).setOrigin(1, 0.5);

      startY += 58;
    });

    // ACTION BUTTONS: START GAME & MAIN MENU
    const startBtn = this.add.container(width / 2 - 130, 585);
    const startBg = this.add.graphics();
    startBg.fillStyle(0xFF6600, 1);
    startBg.fillRoundedRect(-110, -26, 220, 52, 26);
    startBg.lineStyle(3, 0xFFD700, 1);
    startBg.strokeRoundedRect(-110, -26, 220, 52, 26);

    const startText = this.add.text(0, 0, 'START GAME 🪔', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '20px',
      color: '#FFFFFF',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    startBtn.add([startBg, startText]);
    startBtn.setSize(220, 52);
    startBtn.setInteractive({ useHandCursor: true });
    startBtn.on('pointerover', () => startBtn.setScale(1.06));
    startBtn.on('pointerout', () => startBtn.setScale(1));
    startBtn.on('pointerdown', () => this.startGame());

    const menuBtn = this.add.container(width / 2 + 130, 585);
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
    menuBtn.on('pointerover', () => menuBtn.setScale(1.06));
    menuBtn.on('pointerout', () => menuBtn.setScale(1));
    menuBtn.on('pointerdown', () => this.openMainMenu());

    // Key Listeners
    const onSpace = () => this.startGame();
    const onEnter = () => this.startGame();
    const onEsc = () => this.openMainMenu();

    this.input.keyboard.once('keydown-SPACE', onSpace);
    this.input.keyboard.once('keydown-ENTER', onEnter);
    this.input.keyboard.once('keydown-ESC', onEsc);

    this.events.once('shutdown', () => {
      this.input.keyboard.off('keydown-SPACE', onSpace);
      this.input.keyboard.off('keydown-ENTER', onEnter);
      this.input.keyboard.off('keydown-ESC', onEsc);
    });
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

  openMainMenu() {
    this.scene.start('MainMenuScene');
  }
}
