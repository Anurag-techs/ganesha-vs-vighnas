import { EventBus } from '../EventBus';
import { soundManager } from './SoundManager';

export default class ScoreManager {
  constructor() {
    this.score = 0;
    this.highScore = this.loadHighScore();
    this.isNewHighScore = false;
    this.modaks = 0;
    this.vighnasRemoved = 0;
    this.highestCombo = 1;
    this.health = 100;
    this.maxHealth = 100;
    this.divineEnergy = 100;
    this.maxDivineEnergy = 100;

    // Combo System
    this.combo = 1;
    this.comboTimer = 0;
    this.comboMaxTime = 2500;
  }

  loadHighScore() {
    try {
      const saved = localStorage.getItem('ganesha_high_score');
      return saved ? parseInt(saved, 10) : 0;
    } catch (e) {
      return 0;
    }
  }

  saveHighScore() {
    try {
      localStorage.setItem('ganesha_high_score', this.highScore.toString());
    } catch (e) {
      // Storage unavailable fallback
    }
  }

  reset() {
    this.score = 0;
    this.modaks = 0;
    this.vighnasRemoved = 0;
    this.highestCombo = 1;
    this.health = 100;
    this.divineEnergy = 100;
    this.combo = 1;
    this.comboTimer = 0;
    this.isNewHighScore = false;
    this.emitUpdate();
  }

  addModak(basePoints = 50) {
    this.modaks += 1;
    this.addScore(basePoints);
    this.addDivineEnergy(15);
    soundManager.playModakSound();
  }

  addVighnaDefeated() {
    this.vighnasRemoved += 1;
    this.combo = Math.min(10, this.combo + 1);
    this.comboTimer = this.comboMaxTime;

    if (this.combo > this.highestCombo) {
      this.highestCombo = this.combo;
    }

    soundManager.playComboSound(this.combo);

    const awardedPoints = 100 * this.combo;
    this.addScore(awardedPoints);
    this.addDivineEnergy(20);

    return { points: awardedPoints, combo: this.combo };
  }

  addScore(points) {
    this.score += points;
    if (this.score > this.highScore) {
      if (!this.isNewHighScore && this.highScore > 0) {
        soundManager.playHighScoreSound();
      }
      this.highScore = this.score;
      this.isNewHighScore = true;
      this.saveHighScore();
    }
    this.emitUpdate();
  }

  addHealth(amount = 25) {
    this.health = Math.min(this.maxHealth, this.health + amount);
    this.emitUpdate();
  }

  updateCombo(dtSeconds) {
    if (this.comboTimer > 0) {
      this.comboTimer -= dtSeconds * 1000;
      if (this.comboTimer <= 0) {
        this.comboTimer = 0;
        this.combo = 1;
        this.emitUpdate();
      } else {
        EventBus.emit('combo-updated', {
          combo: this.combo,
          comboRatio: this.comboTimer / this.comboMaxTime
        });
      }
    }
  }

  takeDamage(amount = 20) {
    this.health = Math.max(0, this.health - amount);
    this.combo = 1;
    this.comboTimer = 0;
    soundManager.playHitSound();
    this.emitUpdate();
    return this.health <= 0;
  }

  useDivineEnergy(amount) {
    if (this.divineEnergy >= amount) {
      this.divineEnergy -= amount;
      this.emitUpdate();
      return true;
    }
    return false;
  }

  addDivineEnergy(amount) {
    this.divineEnergy = Math.min(this.maxDivineEnergy, this.divineEnergy + amount);
    this.emitUpdate();
  }

  regenDivineEnergy(amount) {
    if (this.divineEnergy < this.maxDivineEnergy) {
      this.divineEnergy = Math.min(this.maxDivineEnergy, this.divineEnergy + amount);
      this.emitUpdate();
    }
  }

  emitUpdate() {
    EventBus.emit('stats-updated', {
      score: this.score,
      highScore: this.highScore,
      isNewHighScore: this.isNewHighScore,
      modaks: this.modaks,
      vighnasRemoved: this.vighnasRemoved,
      highestCombo: this.highestCombo,
      health: this.health,
      maxHealth: this.maxHealth,
      divineEnergy: Math.floor(this.divineEnergy),
      maxDivineEnergy: this.maxDivineEnergy,
      combo: this.combo,
      comboRatio: this.comboMaxTime > 0 ? this.comboTimer / this.comboMaxTime : 0
    });
  }
}
