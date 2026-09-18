import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create() {
    this.createPlaceholderTextures();
    this.scene.start('MainMenuScene');
  }

  createPlaceholderTextures() {
    // 1. Polished Lord Ganesha Character Texture (64x84)
    const ganeshaCanvas = this.make.graphics({ x: 0, y: 0, add: false });
    
    // Outer Divine Golden Aura Ring
    ganeshaCanvas.fillStyle(0xFFD700, 0.4);
    ganeshaCanvas.fillCircle(32, 45, 32);
    ganeshaCanvas.lineStyle(2, 0xFF6600, 0.8);
    ganeshaCanvas.strokeCircle(32, 45, 32);

    // Dhoti / Body (Warm Royal Saffron)
    ganeshaCanvas.fillStyle(0xFF5500, 1);
    ganeshaCanvas.fillRoundedRect(16, 42, 32, 34, 10);
    
    // Yellow Stolen Shawl / Dupatta
    ganeshaCanvas.fillStyle(0xFFCC00, 1);
    ganeshaCanvas.fillRect(12, 47, 40, 7);

    // Head (Divine Light Saffron Skin Tone)
    ganeshaCanvas.fillStyle(0xFF8833, 1);
    ganeshaCanvas.fillCircle(32, 32, 17);

    // Large Elephant Ears with Inner Pink Petals
    ganeshaCanvas.fillStyle(0xFF7722, 1);
    ganeshaCanvas.fillCircle(13, 30, 11);
    ganeshaCanvas.fillCircle(51, 30, 11);
    ganeshaCanvas.fillStyle(0xFFBBAA, 1);
    ganeshaCanvas.fillCircle(13, 30, 6);
    ganeshaCanvas.fillCircle(51, 30, 6);

    // Curved Trunk with Golden Accent
    ganeshaCanvas.fillStyle(0xFF8833, 1);
    ganeshaCanvas.beginPath();
    ganeshaCanvas.moveTo(30, 32);
    ganeshaCanvas.lineTo(25, 48);
    ganeshaCanvas.lineTo(39, 50);
    ganeshaCanvas.lineTo(37, 43);
    ganeshaCanvas.closePath();
    ganeshaCanvas.fill();

    // Mukut / Elaborate Golden Crown
    ganeshaCanvas.fillStyle(0xFFD700, 1);
    ganeshaCanvas.beginPath();
    ganeshaCanvas.moveTo(16, 22);
    ganeshaCanvas.lineTo(32, 2);
    ganeshaCanvas.lineTo(48, 22);
    ganeshaCanvas.closePath();
    ganeshaCanvas.fill();
    
    // Ruby Gem in Mukut
    ganeshaCanvas.fillStyle(0xEE1111, 1);
    ganeshaCanvas.fillCircle(32, 12, 4);

    // Sacred Red & Yellow Tilak on forehead
    ganeshaCanvas.fillStyle(0xFFD700, 1);
    ganeshaCanvas.fillRect(28, 20, 8, 8);
    ganeshaCanvas.fillStyle(0xEE1111, 1);
    ganeshaCanvas.fillRect(30, 22, 4, 6);

    // Golden Modak in hand
    ganeshaCanvas.fillStyle(0xFFDD00, 1);
    ganeshaCanvas.fillCircle(49, 49, 6);

    ganeshaCanvas.generateTexture('ganesha_player', 64, 84);

    // 2. Mandap Temple Pillar / Arch Graphic (80x160)
    const mandapCanvas = this.make.graphics({ x: 0, y: 0, add: false });
    mandapCanvas.fillStyle(0x4A154B, 0.6);
    mandapCanvas.fillRect(0, 0, 80, 160);
    mandapCanvas.fillStyle(0xFFD700, 0.9);
    mandapCanvas.fillRect(0, 0, 80, 12);
    mandapCanvas.fillRect(0, 148, 80, 12);
    mandapCanvas.fillRect(20, 12, 40, 136);
    mandapCanvas.fillStyle(0xFF6600, 1);
    mandapCanvas.fillCircle(40, 80, 14);
    mandapCanvas.generateTexture('mandap_arch', 80, 160);

    // 3. Rangoli Floor Trim (64x32)
    const rangoliCanvas = this.make.graphics({ x: 0, y: 0, add: false });
    rangoliCanvas.fillStyle(0x7A2916, 1);
    rangoliCanvas.fillRect(0, 0, 64, 32);
    rangoliCanvas.fillStyle(0xFF9900, 1);
    rangoliCanvas.fillRect(0, 0, 64, 4);
    rangoliCanvas.fillStyle(0xFFD700, 1);
    for (let x = 8; x < 64; x += 16) {
      rangoliCanvas.fillCircle(x, 16, 6);
      rangoliCanvas.fillStyle(0xFF0055, 1);
      rangoliCanvas.fillCircle(x, 16, 3);
      rangoliCanvas.fillStyle(0xFFD700, 1);
    }
    rangoliCanvas.generateTexture('rangoli_floor', 64, 32);

    // 4. Diya Clay Lamp with Flickering Flame (32x40)
    const diyaCanvas = this.make.graphics({ x: 0, y: 0, add: false });
    diyaCanvas.fillStyle(0xB85C00, 1);
    diyaCanvas.fillTriangle(16, 24, 2, 38, 30, 38);
    diyaCanvas.fillStyle(0xFFD700, 1);
    diyaCanvas.fillCircle(16, 16, 8);
    diyaCanvas.fillStyle(0xFF3300, 1);
    diyaCanvas.fillCircle(16, 12, 5);
    diyaCanvas.fillStyle(0xFFFFFF, 1);
    diyaCanvas.fillCircle(16, 10, 2);
    diyaCanvas.generateTexture('diya_lamp', 32, 40);

    // 5. Confetti Particle (12x12)
    const confettiCanvas = this.make.graphics({ x: 0, y: 0, add: false });
    confettiCanvas.fillStyle(0xFFD700, 1);
    confettiCanvas.fillRect(0, 0, 12, 12);
    confettiCanvas.generateTexture('confetti_particle', 12, 12);

    // 6. Basic Vighna Enemy Texture (54x54)
    const vighnaCanvas = this.make.graphics({ x: 0, y: 0, add: false });
    vighnaCanvas.fillStyle(0x3A0B2E, 1);
    vighnaCanvas.fillCircle(27, 27, 24);
    vighnaCanvas.fillStyle(0x660033, 1);
    vighnaCanvas.fillTriangle(27, 0, 16, 12, 38, 12);
    vighnaCanvas.fillTriangle(0, 27, 12, 16, 12, 38);
    vighnaCanvas.fillTriangle(54, 27, 42, 16, 42, 38);
    vighnaCanvas.fillStyle(0xFF0033, 1);
    vighnaCanvas.fillCircle(18, 22, 5);
    vighnaCanvas.fillCircle(36, 22, 5);
    vighnaCanvas.fillStyle(0xFFF700, 1);
    vighnaCanvas.fillCircle(18, 22, 2);
    vighnaCanvas.fillCircle(36, 22, 2);
    vighnaCanvas.generateTexture('vighna_enemy', 54, 54);

    // 7. Fast Vighna Texture (44x44)
    const fastCanvas = this.make.graphics({ x: 0, y: 0, add: false });
    fastCanvas.fillStyle(0x990022, 1);
    fastCanvas.beginPath();
    fastCanvas.moveTo(44, 22);
    fastCanvas.lineTo(4, 4);
    fastCanvas.lineTo(12, 22);
    fastCanvas.lineTo(4, 40);
    fastCanvas.closePath();
    fastCanvas.fill();
    fastCanvas.fillStyle(0xFFFF00, 1);
    fastCanvas.fillCircle(24, 16, 3);
    fastCanvas.fillCircle(24, 28, 3);
    fastCanvas.generateTexture('vighna_fast', 44, 44);

    // 8. Heavy Vighna Texture (68x68)
    const heavyCanvas = this.make.graphics({ x: 0, y: 0, add: false });
    heavyCanvas.fillStyle(0x1F051C, 1);
    heavyCanvas.fillRoundedRect(6, 6, 56, 56, 12);
    heavyCanvas.fillStyle(0xFF3300, 1);
    heavyCanvas.fillTriangle(6, 12, 0, 0, 16, 6);
    heavyCanvas.fillTriangle(62, 12, 68, 0, 52, 6);
    heavyCanvas.fillStyle(0xFF0055, 1);
    heavyCanvas.fillCircle(24, 28, 7);
    heavyCanvas.fillCircle(44, 28, 7);
    heavyCanvas.fillStyle(0xFFFFFF, 1);
    heavyCanvas.fillRect(20, 48, 28, 6);
    heavyCanvas.generateTexture('vighna_heavy', 68, 68);

    // 9. Swarm Vighna Texture (32x32)
    const swarmCanvas = this.make.graphics({ x: 0, y: 0, add: false });
    swarmCanvas.fillStyle(0x550055, 1);
    swarmCanvas.fillCircle(16, 16, 14);
    swarmCanvas.fillStyle(0x00FFCC, 1);
    swarmCanvas.fillCircle(10, 14, 3);
    swarmCanvas.fillCircle(22, 14, 3);
    swarmCanvas.generateTexture('vighna_swarm', 32, 32);

    // 10. MAHA VIGHNA BOSS TEXTURE (140x140)
    const bossCanvas = this.make.graphics({ x: 0, y: 0, add: false });
    bossCanvas.fillStyle(0xFF0033, 0.3);
    bossCanvas.fillCircle(70, 70, 68);
    bossCanvas.fillStyle(0x1B021A, 1);
    bossCanvas.fillCircle(70, 70, 56);
    bossCanvas.fillStyle(0xAA0033, 1);
    bossCanvas.fillTriangle(70, 4, 45, 30, 95, 30);
    bossCanvas.fillTriangle(30, 20, 10, 5, 45, 40);
    bossCanvas.fillTriangle(110, 20, 130, 5, 95, 40);
    bossCanvas.fillStyle(0xFFD700, 1);
    bossCanvas.fillCircle(48, 60, 12);
    bossCanvas.fillCircle(92, 60, 12);
    bossCanvas.fillStyle(0xFF0000, 1);
    bossCanvas.fillCircle(48, 60, 5);
    bossCanvas.fillCircle(92, 60, 5);
    bossCanvas.fillStyle(0xFFFFFF, 1);
    bossCanvas.fillTriangle(50, 90, 60, 90, 55, 105);
    bossCanvas.fillTriangle(80, 90, 90, 90, 85, 105);
    bossCanvas.generateTexture('maha_vighna_boss', 140, 140);

    // 11. Telegraph Warning Ring (96x96)
    const warningCanvas = this.make.graphics({ x: 0, y: 0, add: false });
    warningCanvas.fillStyle(0xFF0033, 0.35);
    warningCanvas.fillCircle(48, 48, 46);
    warningCanvas.lineStyle(4, 0xFFCC00, 0.9);
    warningCanvas.strokeCircle(48, 48, 44);
    warningCanvas.generateTexture('warning_ring', 96, 96);

    // 12. Modak & Ground Tiles
    const modakCanvas = this.make.graphics({ x: 0, y: 0, add: false });
    modakCanvas.fillStyle(0xFFD700, 0.4);
    modakCanvas.fillCircle(16, 16, 15);
    modakCanvas.fillStyle(0xFFB700, 1);
    modakCanvas.fillCircle(16, 20, 10);
    modakCanvas.fillTriangle(16, 4, 7, 22, 25, 22);
    modakCanvas.fillStyle(0xFFF0AA, 1);
    modakCanvas.fillRect(14, 10, 4, 12);
    modakCanvas.fillRect(10, 14, 2, 8);
    modakCanvas.fillRect(20, 14, 2, 8);
    modakCanvas.generateTexture('modak', 32, 32);

    const groundCanvas = this.make.graphics({ x: 0, y: 0, add: false });
    groundCanvas.fillStyle(0x7A2916, 1);
    groundCanvas.fillRect(0, 0, 64, 64);
    groundCanvas.fillStyle(0xFF9900, 1);
    groundCanvas.fillRect(0, 0, 64, 8);
    groundCanvas.fillStyle(0xFFD700, 1);
    for (let x = 4; x < 64; x += 16) {
      groundCanvas.fillCircle(x + 4, 4, 4);
    }
    groundCanvas.fillStyle(0x591B0D, 1);
    groundCanvas.fillRect(0, 32, 64, 2);
    groundCanvas.fillRect(32, 8, 2, 24);
    groundCanvas.fillRect(16, 34, 2, 30);
    groundCanvas.generateTexture('ground_tile', 64, 64);

    const platformCanvas = this.make.graphics({ x: 0, y: 0, add: false });
    platformCanvas.fillStyle(0x4A154B, 1);
    platformCanvas.fillRoundedRect(0, 0, 64, 32, 6);
    platformCanvas.fillStyle(0xFFD700, 1);
    platformCanvas.fillRect(0, 0, 64, 4);
    platformCanvas.fillRect(0, 28, 64, 4);
    platformCanvas.generateTexture('platform_tile', 64, 32);

    const blastCanvas = this.make.graphics({ x: 0, y: 0, add: false });
    blastCanvas.fillStyle(0xFFCC00, 0.9);
    blastCanvas.beginPath();
    blastCanvas.moveTo(4, 32);
    blastCanvas.lineTo(58, 4);
    blastCanvas.lineTo(58, 60);
    blastCanvas.closePath();
    blastCanvas.fill();
    blastCanvas.fillStyle(0xFFFFFF, 0.9);
    blastCanvas.fillCircle(14, 32, 10);
    blastCanvas.generateTexture('trunk_blast_wave', 64, 64);

    const auraCanvas = this.make.graphics({ x: 0, y: 0, add: false });
    auraCanvas.fillStyle(0xFFD700, 0.4);
    auraCanvas.fillCircle(80, 80, 78);
    auraCanvas.lineStyle(6, 0xFF6600, 0.9);
    auraCanvas.strokeCircle(80, 80, 70);
    auraCanvas.lineStyle(4, 0xFFFFFF, 1);
    auraCanvas.strokeCircle(80, 80, 50);
    auraCanvas.generateTexture('vakratunda_aura', 160, 160);

    const sparkCanvas = this.make.graphics({ x: 0, y: 0, add: false });
    sparkCanvas.fillStyle(0xFFD700, 1);
    sparkCanvas.fillCircle(8, 8, 7);
    sparkCanvas.fillStyle(0xFFFFFF, 1);
    sparkCanvas.fillCircle(8, 8, 3);
    sparkCanvas.generateTexture('gold_particle', 16, 16);

    const redParticleCanvas = this.make.graphics({ x: 0, y: 0, add: false });
    redParticleCanvas.fillStyle(0xFF0044, 1);
    redParticleCanvas.fillTriangle(8, 0, 0, 16, 16, 16);
    redParticleCanvas.generateTexture('vighna_damage_particle', 16, 16);
  }
}
