import Phaser from 'phaser';
import { EventBus } from '../EventBus';
import { soundManager } from '../systems/SoundManager';
import { FastVighna, SwarmVighna } from './VighnaTypes';

export default class MahaVighnaBoss extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'maha_vighna_boss');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setBounce(0.1);
    this.setDragX(500);
    this.setDepth(12);

    // Boss Hitbox
    this.body.setSize(110, 110);
    this.body.setOffset(15, 15);

    // Boss Stats
    this.hp = 500;
    this.maxHp = 500;
    this.moveSpeed = 80;
    this.currentPhase = 1;
    this.isHit = false;
    this.isDefeated = false;
    this.contactDamage = 40;

    // Skill Timers
    this.lastStompTime = 0;
    this.lastMinionTime = 0;
    this.stompCooldown = 6000;
    this.minionCooldown = 8000;

    // Pulse animation
    this.pulseTween = this.scene.tweens.add({
      targets: this,
      scaleX: 1.08,
      scaleY: 1.08,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.emitBossStats();
  }

  update(time, delta, playerX, playerY) {
    if (this.isDefeated || !this.body) return;

    // Check Phase Shift Transitions
    const hpRatio = this.hp / this.maxHp;
    if (hpRatio <= 0.30 && this.currentPhase < 3) {
      this.enterPhase(3);
    } else if (hpRatio <= 0.60 && this.currentPhase < 2) {
      this.enterPhase(2);
    }

    // Seeking AI Movement toward Ganesha
    if (playerX !== undefined && !this.isHit) {
      const dist = playerX - this.x;
      if (Math.abs(dist) > 25) {
        const speed = this.moveSpeed * (this.currentPhase === 3 ? 1.6 : this.currentPhase === 2 ? 1.3 : 1.0);
        this.setVelocityX(dist > 0 ? speed : -speed);
        this.setFlipX(dist < 0);
      } else {
        this.setVelocityX(0);
      }
    }

    // Phase-specific Skill Triggers
    if (time - this.lastStompTime > (this.currentPhase === 3 ? 4000 : 7000)) {
      this.lastStompTime = time;
      this.performTelegraphedStomp(playerX, playerY);
    }

    if (time - this.lastMinionTime > (this.currentPhase >= 2 ? 6500 : 10000)) {
      this.lastMinionTime = time;
      this.summonMinions();
    }
  }

  enterPhase(phaseNumber) {
    this.currentPhase = phaseNumber;

    if (phaseNumber === 2) {
      this.setTint(0xCC00FF);
      EventBus.emit('wave-announcement', {
        text: '🔥 MAHA VIGHNA ENRAGED! (PHASE 2)',
        subtitle: 'Faster Movement & Minion Spawns!'
      });
    } else if (phaseNumber === 3) {
      this.setTint(0xFF3300);
      EventBus.emit('wave-announcement', {
        text: '⚡ MAHA VIGHNA FINAL DESPERATION! (PHASE 3)',
        subtitle: 'Frequent Area Stomp Shockwaves!'
      });
    }

    soundManager.playVakratundaSound();
    this.emitBossStats();
  }

  performTelegraphedStomp(targetX, targetY) {
    if (!this.active || this.isDefeated) return;

    const stompX = targetX || this.x;
    const stompY = 620; // Ground level

    // 1. Telegraph Warning Indicator Ring on Ground
    const warning = this.scene.add.sprite(stompX, stompY, 'warning_ring');
    warning.setScale(0.3);
    warning.setAlpha(0.8);

    this.scene.tweens.add({
      targets: warning,
      scaleX: 2.4,
      scaleY: 2.4,
      alpha: 1,
      duration: 1000,
      ease: 'Sine.easeOut',
      onComplete: () => {
        warning.destroy();

        if (this.active && !this.isDefeated) {
          // 2. Boss Slam Shockwave Execution
          this.scene.cameras.main.shake(250, 0.016);
          soundManager.playVakratundaSound();

          const shockwave = this.scene.add.sprite(stompX, stompY, 'vakratunda_aura');
          shockwave.setTint(0xFF0033);
          shockwave.setScale(0.3);

          this.scene.tweens.add({
            targets: shockwave,
            scaleX: 2.8,
            scaleY: 2.8,
            alpha: 0,
            duration: 400,
            onComplete: () => shockwave.destroy()
          });

          // Damage check on player if in stomp radius
          const distToPlayer = Phaser.Math.Distance.Between(stompX, stompY, this.scene.player.x, this.scene.player.y);
          if (distToPlayer <= 220) {
            this.scene.scoreManager.takeDamage(30);
            this.scene.player.playHitAnimation();
          }
        }
      }
    });
  }

  summonMinions() {
    if (!this.active || this.isDefeated) return;

    this.scene.showFloatingText(this.x, this.y - 80, 'SUMMONING VIGHNAS! 👿', '#FF0055');

    const m1 = new FastVighna(this.scene, this.x - 120, this.y - 20);
    const m2 = new SwarmVighna(this.scene, this.x + 120, this.y - 20);
    this.scene.vighnas.add(m1);
    this.scene.vighnas.add(m2);
  }

  takeDamage(amount, sourceX) {
    if (this.isDefeated) return false;

    this.hp -= amount;
    this.isHit = true;

    // Flashing Red Hit Tint
    this.setTint(0xFF0000);
    this.scene.showFloatingText(this.x, this.y - 60, `-${amount}`, '#FF1744');

    if (this.scene.vighnaEmitter) {
      this.scene.vighnaEmitter.explode(15, this.x, this.y);
    }

    this.emitBossStats();

    if (this.hp <= 0) {
      this.defeat();
      return true;
    }

    this.scene.time.delayedCall(250, () => {
      if (this.active && !this.isDefeated) {
        this.clearTint();
        if (this.currentPhase === 2) this.setTint(0xCC00FF);
        if (this.currentPhase === 3) this.setTint(0xFF3300);
        this.isHit = false;
      }
    });

    return false;
  }

  defeat() {
    if (this.isDefeated) return;
    this.isDefeated = true;

    this.setVelocity(0, 0);
    this.body.enable = false;

    // Non-violent Divine Dissolution Sequence
    soundManager.playHighScoreSound();
    
    // Golden rays burst
    if (this.scene.goldEmitter) {
      this.scene.goldEmitter.explode(60, this.x, this.y);
    }

    this.scene.scoreManager.addScore(1500);

    EventBus.emit('wave-announcement', {
      text: '🪔 ALL OBSTACLES REMOVED! DIVINE VICTORY! 🪔',
      subtitle: 'Maha Vighna Cleansed by Lord Ganesha!'
    });

    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scaleX: 2.2,
      scaleY: 2.2,
      duration: 1800,
      onComplete: () => {
        this.destroy();
        this.scene.time.delayedCall(1000, () => {
          this.scene.scene.start('VictoryScene', {
            score: this.scene.scoreManager.score,
            highScore: this.scene.scoreManager.highScore,
            isNewHighScore: this.scene.scoreManager.isNewHighScore,
            modaks: this.scene.scoreManager.modaks
          });
        });
      }
    });
  }

  emitBossStats() {
    EventBus.emit('boss-stats-updated', {
      active: !this.isDefeated && this.hp > 0,
      hp: Math.max(0, this.hp),
      maxHp: this.maxHp,
      phase: this.currentPhase,
      name: 'MAHA VIGHNA - SUPREME OBSTACLE'
    });
  }
}
