import Phaser from 'phaser';
import Player from '../entities/Player';
import { BasicVighna, FastVighna, HeavyVighna, SwarmVighna } from '../entities/VighnaTypes';
import MahaVighnaBoss from '../entities/MahaVighnaBoss';
import ScoreManager from '../systems/ScoreManager';
import WaveManager from '../systems/WaveManager';
import { audioManager } from '../systems/AudioManager';
import { EventBus } from '../EventBus';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    EventBus.emit('scene-changed', 'GameScene');

    // Start BGM synth loop if enabled
    audioManager.startBGM();

    const worldWidth = 2400;
    const worldHeight = 720;

    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);

    // Systems initialization
    this.scoreManager = new ScoreManager();
    this.waveManager = new WaveManager();
    this.scoreManager.reset();
    this.waveManager.reset();

    // Environment & Mandap Visuals
    this.createEnvironment(worldWidth, worldHeight);
    this.platforms = this.physics.add.staticGroup();
    this.modaks = this.physics.add.group();
    this.vighnas = this.physics.add.group();

    this.buildLevelLayout(worldWidth, worldHeight);
    this.setupParticles();

    // Create Player
    this.player = new Player(this, 150, 450);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    // Collisions
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.vighnas, this.platforms);

    // Overlaps
    this.physics.add.overlap(this.player, this.modaks, this.collectModak, null, this);
    this.physics.add.overlap(this.player, this.vighnas, this.hitPlayerWithVighna, null, this);

    // Touch Event Listeners for Mobile Controls
    this.setupTouchListeners();

    // Spawn initial Modaks
    this.spawnModaks();

    // Start Wave 1
    this.waveManager.startWave();
    this.startWaveSpawnerTimer();

    this.isInvulnerable = false;
    this.boss = null;
  }

  setupTouchListeners() {
    this.touchLeftHandler = (val) => { if (this.player) this.player.touchLeft = val; };
    this.touchRightHandler = (val) => { if (this.player) this.player.touchRight = val; };
    this.touchJumpHandler = () => { if (this.player) this.player.touchJumpTriggered = true; };
    this.touchAttackEHandler = () => { this.executeTrunkBlast(this.time.now); };
    this.touchAttackQHandler = () => { this.executeVakratundaStrike(this.time.now); };

    EventBus.on('touch-move-left', this.touchLeftHandler);
    EventBus.on('touch-move-right', this.touchRightHandler);
    EventBus.on('touch-jump', this.touchJumpHandler);
    EventBus.on('touch-attack-e', this.touchAttackEHandler);
    EventBus.on('touch-attack-q', this.touchAttackQHandler);

    this.events.once('shutdown', () => {
      audioManager.stopBGM();
      if (this.spawnerTimer) {
        this.spawnerTimer.destroy();
      }
      EventBus.off('touch-move-left', this.touchLeftHandler);
      EventBus.off('touch-move-right', this.touchRightHandler);
      EventBus.off('touch-jump', this.touchJumpHandler);
      EventBus.off('touch-attack-e', this.touchAttackEHandler);
      EventBus.off('touch-attack-q', this.touchAttackQHandler);
    });
  }

  setupParticles() {
    this.goldEmitter = this.add.particles(0, 0, 'gold_particle', {
      speed: { min: 80, max: 220 },
      scale: { start: 1, end: 0 },
      lifespan: 500,
      blendMode: 'ADD',
      emitting: false
    });

    this.vighnaEmitter = this.add.particles(0, 0, 'vighna_damage_particle', {
      speed: { min: 60, max: 180 },
      scale: { start: 1.2, end: 0 },
      lifespan: 450,
      blendMode: 'COLOR_DODGE',
      emitting: false
    });
  }

  createEnvironment(worldWidth, worldHeight) {
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1a052c, 0x1a052c, 0x4a0e2e, 0x4a0e2e, 1);
    bg.fillRect(0, 0, worldWidth, worldHeight);

    for (let x = 150; x < worldWidth; x += 480) {
      const arch = this.add.image(x, worldHeight - 140, 'mandap_arch');
      arch.setAlpha(0.4);
      arch.setScale(1.2);
    }

    for (let x = 0; x < worldWidth; x += 40) {
      this.add.circle(x, 10 + Math.sin(x * 0.05) * 8, 6, 0xFF9900);
      this.add.circle(x + 20, 15 + Math.sin((x + 20) * 0.05) * 8, 4, 0xFFD700);

      if (x % 300 === 0 && x > 0) {
        const diya = this.add.image(x, worldHeight - 64, 'diya_lamp');
        this.tweens.add({
          targets: diya,
          alpha: 0.7,
          duration: 400 + Math.random() * 400,
          yoyo: true,
          repeat: -1
        });
      }
    }
  }

  buildLevelLayout(worldWidth, worldHeight) {
    for (let x = 0; x < worldWidth; x += 64) {
      this.platforms.create(x + 32, worldHeight - 32, 'ground_tile').refreshBody();
    }

    const platformLocations = [
      { x: 300, y: 540, count: 4 },
      { x: 650, y: 420, count: 5 },
      { x: 1050, y: 520, count: 4 },
      { x: 1400, y: 380, count: 6 },
      { x: 1850, y: 500, count: 5 },
      { x: 2150, y: 360, count: 4 }
    ];

    platformLocations.forEach(p => {
      for (let i = 0; i < p.count; i++) {
        this.platforms.create(p.x + (i * 64), p.y, 'rangoli_floor').refreshBody();
      }
    });
  }

  spawnModaks() {
    this.modaks.clear(true, true);
    
    const modakPositions = [
      { x: 350, y: 480 },
      { x: 420, y: 480 },
      { x: 700, y: 360 },
      { x: 800, y: 360 },
      { x: 1100, y: 460 },
      { x: 1450, y: 320 },
      { x: 1600, y: 320 },
      { x: 1900, y: 440 },
      { x: 2200, y: 300 },
      { x: 1200, y: 600 }
    ];

    modakPositions.forEach(pos => {
      const m = this.modaks.create(pos.x, pos.y, 'modak');
      m.setBounceY(0.2);
      m.setCollideWorldBounds(true);
      
      this.tweens.add({
        targets: m,
        y: pos.y - 8,
        duration: 1200 + Math.random() * 400,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    });

    this.physics.add.collider(this.modaks, this.platforms);
  }

  startWaveSpawnerTimer() {
    if (this.spawnerTimer) {
      this.spawnerTimer.destroy();
    }

    const config = this.waveManager.getWaveConfig();

    if (config.isBossWave) {
      this.spawnMahaVighnaBoss();
      return;
    }

    this.spawnWaveVighna();

    this.spawnerTimer = this.time.addEvent({
      delay: config.spawnInterval,
      callback: this.spawnWaveVighna,
      callbackScope: this,
      loop: true
    });
  }

  spawnWaveVighna() {
    const config = this.waveManager.getWaveConfig();

    if (this.waveManager.enemiesSpawned >= config.count) {
      if (this.spawnerTimer) {
        this.spawnerTimer.destroy();
        this.spawnerTimer = null;
      }
      return;
    }

    const side = Math.random() < 0.5 ? -1 : 1;
    const spawnX = Phaser.Math.Clamp(
      this.player.x + side * Phaser.Math.Between(450, 750),
      100,
      2300
    );
    const spawnY = Phaser.Math.Between(200, 600);

    const types = config.types || ['basic'];
    const chosenType = types[Math.floor(Math.random() * types.length)];

    let vighna;
    switch (chosenType) {
      case 'fast':
        vighna = new FastVighna(this, spawnX, spawnY);
        break;
      case 'heavy':
        vighna = new HeavyVighna(this, spawnX, spawnY);
        break;
      case 'swarm':
        vighna = new SwarmVighna(this, spawnX, spawnY);
        this.vighnas.add(new SwarmVighna(this, spawnX + 30, spawnY - 15));
        break;
      case 'basic':
      default:
        vighna = new BasicVighna(this, spawnX, spawnY);
        break;
    }

    this.vighnas.add(vighna);
    this.waveManager.onEnemySpawned();
  }

  spawnMahaVighnaBoss() {
    this.boss = new MahaVighnaBoss(this, 1200, 480);
    this.physics.add.collider(this.boss, this.platforms);
    this.physics.add.overlap(this.player, this.boss, this.hitPlayerWithBoss, null, this);
    this.waveManager.onEnemySpawned();
  }

  handleVighnaDefeated() {
    const config = this.waveManager.getWaveConfig();
    // In boss wave, minion defeats count for score/combo, but do not clear the wave prematurely
    if (config.isBossWave) {
      return;
    }

    const result = this.waveManager.onEnemyDefeated();

    if (result.isWaveCleared) {
      this.onWaveCleared();
    }
  }

  onWaveCleared() {
    if (this.spawnerTimer) {
      this.spawnerTimer.destroy();
    }

    this.scoreManager.addHealth(25);
    this.scoreManager.addDivineEnergy(30);
    audioManager.playWaveClearedSound();

    this.showFloatingText(this.player.x, this.player.y - 60, '+25 HP  •  +30 DIVINE ENERGY BONUS! 🪔', '#00E676');

    EventBus.emit('wave-announcement', {
      text: `WAVE ${this.waveManager.currentWave} CLEARED!`,
      subtitle: `+25 HP & +30 Divine Energy Restored!`
    });

    this.time.delayedCall(3200, () => {
      this.advanceToNextWave();
    });
  }

  advanceToNextWave() {
    const hasMoreWaves = this.waveManager.nextWave();

    if (hasMoreWaves) {
      if (this.modaks.countActive(true) < 3) {
        this.spawnModaks();
      }
      this.startWaveSpawnerTimer();
    } else {
      audioManager.stopBGM();
      audioManager.playVictorySound();
      this.scene.start('VictoryScene', {
        score: this.scoreManager.score,
        highScore: this.scoreManager.highScore,
        isNewHighScore: this.scoreManager.isNewHighScore,
        modaks: this.scoreManager.modaks,
        vighnasRemoved: this.scoreManager.vighnasRemoved,
        highestCombo: this.scoreManager.highestCombo
      });
    }
  }

  executeTrunkBlast(time) {
    if (time - this.player.lastTrunkBlast < this.player.trunkBlastCd) return;

    this.player.lastTrunkBlast = time;
    this.player.playAttackAnimation();
    audioManager.playAttackSound();

    const facingRight = this.player.facingRight;
    const blastX = facingRight ? this.player.x + 55 : this.player.x - 55;
    const blastY = this.player.y - 10;

    const wave = this.add.sprite(blastX, blastY, 'trunk_blast_wave');
    wave.setFlipX(!facingRight);
    wave.setScale(0.6);

    this.tweens.add({
      targets: wave,
      scaleX: 1.4,
      scaleY: 1.4,
      alpha: 0,
      duration: 250,
      onComplete: () => wave.destroy()
    });

    if (this.goldEmitter) {
      this.goldEmitter.explode(12, blastX, blastY);
    }

    const blastRange = 140;
    this.vighnas.children.iterate(vighna => {
      if (vighna && vighna.active && !vighna.isDefeated) {
        const inDirection = facingRight ? (vighna.x >= this.player.x && vighna.x <= this.player.x + blastRange)
                                        : (vighna.x <= this.player.x && vighna.x >= this.player.x - blastRange);
        const inVerticalRange = Math.abs(vighna.y - this.player.y) <= 80;

        if (inDirection && inVerticalRange) {
          vighna.takeDamage(20, this.player.x);
        }
      }
    });

    if (this.boss && this.boss.active && !this.boss.isDefeated) {
      const inDirection = facingRight ? (this.boss.x >= this.player.x && this.boss.x <= this.player.x + blastRange + 50)
                                      : (this.boss.x <= this.player.x && this.boss.x >= this.player.x - blastRange - 50);
      const inVerticalRange = Math.abs(this.boss.y - this.player.y) <= 100;
      if (inDirection && inVerticalRange) {
        this.boss.takeDamage(25, this.player.x);
      }
    }
  }

  executeVakratundaStrike(time) {
    if (time - this.player.lastVakratunda < this.player.vakratundaCd) return;

    const hasEnergy = this.scoreManager.useDivineEnergy(25);
    if (!hasEnergy) {
      this.showFloatingText(this.player.x, this.player.y - 40, 'Need Divine Energy!', '#FF3366');
      return;
    }

    this.player.lastVakratunda = time;
    this.player.playAttackAnimation();
    audioManager.playStrongAttackSound();

    this.cameras.main.shake(200, 0.014);

    const shockwave = this.add.sprite(this.player.x, this.player.y, 'vakratunda_aura');
    shockwave.setScale(0.2);

    this.tweens.add({
      targets: shockwave,
      scaleX: 2.5,
      scaleY: 2.5,
      alpha: 0,
      duration: 400,
      onComplete: () => shockwave.destroy()
    });

    if (this.goldEmitter) {
      this.goldEmitter.explode(35, this.player.x, this.player.y);
    }

    this.showFloatingText(this.player.x, this.player.y - 50, 'VAKRATUNDA STRIKE! 🪔', '#FFD700');

    const radius = 260;
    this.vighnas.children.iterate(vighna => {
      if (vighna && vighna.active && !vighna.isDefeated) {
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, vighna.x, vighna.y);
        if (dist <= radius) {
          vighna.takeDamage(45, this.player.x);
        }
      }
    });

    if (this.boss && this.boss.active && !this.boss.isDefeated) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.boss.x, this.boss.y);
      if (dist <= radius + 50) {
        this.boss.takeDamage(55, this.player.x);
      }
    }
  }

  showFloatingText(x, y, text, color = '#FFFFFF') {
    const popup = this.add.text(x, y, text, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '20px',
      color: color,
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5).setDepth(20);

    this.tweens.add({
      targets: popup,
      y: y - 40,
      alpha: 0,
      duration: 850,
      onComplete: () => popup.destroy()
    });
  }

  collectModak(player, modak) {
    if (this.goldEmitter) {
      this.goldEmitter.explode(15, modak.x, modak.y);
    }

    modak.destroy();
    this.scoreManager.addModak(50);
    this.showFloatingText(modak.x, modak.y - 20, '+50 🪔', '#FFD700');
  }

  hitPlayerWithVighna(player, vighna) {
    if (this.isInvulnerable || !vighna.active || vighna.isDefeated) return;

    this.isInvulnerable = true;
    const damage = vighna.contactDamage || 20;
    const isDead = this.scoreManager.takeDamage(damage);

    audioManager.playPlayerDamageSound();
    player.playHitAnimation();

    const pushDir = player.x < vighna.x ? -1 : 1;
    player.setVelocityX(pushDir * 320);
    player.setVelocityY(-220);

    this.time.delayedCall(1000, () => {
      this.isInvulnerable = false;
    });

    if (isDead) {
      this.handlePlayerDeath();
    }
  }

  hitPlayerWithBoss(player, boss) {
    if (this.isInvulnerable || !boss.active || boss.isDefeated) return;

    this.isInvulnerable = true;
    const isDead = this.scoreManager.takeDamage(boss.contactDamage || 40);

    audioManager.playPlayerDamageSound();
    player.playHitAnimation();

    const pushDir = player.x < boss.x ? -1 : 1;
    player.setVelocityX(pushDir * 400);
    player.setVelocityY(-260);

    this.time.delayedCall(1000, () => {
      this.isInvulnerable = false;
    });

    if (isDead) {
      this.handlePlayerDeath();
    }
  }

  handlePlayerDeath() {
    audioManager.stopBGM();
    if (this.spawnerTimer) {
      this.spawnerTimer.destroy();
    }
    this.scene.start('GameOverScene', {
      score: this.scoreManager.score,
      highScore: this.scoreManager.highScore,
      isNewHighScore: this.scoreManager.isNewHighScore,
      modaks: this.scoreManager.modaks,
      vighnasRemoved: this.scoreManager.vighnasRemoved,
      highestCombo: this.scoreManager.highestCombo
    });
  }

  update(time, delta) {
    const dt = delta / 1000;

    if (this.player) {
      this.player.update(time, delta);
    }

    if (this.vighnas) {
      this.vighnas.children.iterate(v => {
        if (v && v.update && v.active) {
          v.update(time, delta, this.player.x, this.player.y);
        }
      });
    }

    if (this.boss && this.boss.update && this.boss.active) {
      this.boss.update(time, delta, this.player.x, this.player.y);
    }

    this.scoreManager.updateCombo(dt);
    this.scoreManager.regenDivineEnergy(3.5 * dt);

    const trunkCdRatio = Math.min(1, (time - this.player.lastTrunkBlast) / this.player.trunkBlastCd);
    const vakratundaCdRatio = Math.min(1, (time - this.player.lastVakratunda) / this.player.vakratundaCd);

    EventBus.emit('cooldowns-updated', {
      trunkBlastReady: trunkCdRatio >= 1,
      trunkBlastRatio: trunkCdRatio,
      vakratundaReady: vakratundaCdRatio >= 1 && this.scoreManager.divineEnergy >= 25,
      vakratundaRatio: vakratundaCdRatio
    });
  }
}
