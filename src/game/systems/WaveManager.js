import { EventBus } from '../EventBus';

export default class WaveManager {
  constructor() {
    this.totalWaves = 6; // Waves 1 to 5 + Wave 6 Maha Vighna Boss
    
    this.waveConfigs = [
      { wave: 1, count: 5, title: 'FESTIVAL BEGINS', types: ['basic'], spawnInterval: 2200 },
      { wave: 2, count: 8, title: 'VIGHNAS APPROACH', types: ['basic', 'fast'], spawnInterval: 1700 },
      { wave: 3, count: 12, title: 'SHADOW SURGE', types: ['fast', 'swarm', 'heavy'], spawnInterval: 1300 },
      { wave: 4, count: 15, title: 'STORM OF OBSTACLES', types: ['fast', 'swarm', 'heavy'], spawnInterval: 1000 },
      { wave: 5, count: 20, title: 'FINAL VIGHNA STORM', types: ['fast', 'heavy', 'swarm'], spawnInterval: 800 },
      { wave: 6, count: 1, title: 'MAHA VIGHNA BOSS BATTLE', types: ['boss'], isBossWave: true, spawnInterval: 0 }
    ];

    this.reset();
  }

  reset() {
    this.currentWave = 1;
    this.enemiesSpawned = 0;
    this.enemiesDefeated = 0;
    this.isWaveActive = false;
    this.isIntermission = false;
    this.emitUpdate();
  }

  getWaveConfig() {
    return this.waveConfigs[this.currentWave - 1] || this.waveConfigs[0];
  }

  startWave() {
    this.enemiesSpawned = 0;
    this.enemiesDefeated = 0;
    this.isWaveActive = true;
    this.isIntermission = false;

    const config = this.getWaveConfig();
    this.emitUpdate();
    
    const subtitle = config.isBossWave 
      ? 'Defeat Maha Vighna to Protect the Festival!' 
      : `Defeat ${config.count} Vighnas!`;

    EventBus.emit('wave-announcement', {
      text: `WAVE ${this.currentWave}: ${config.title}`,
      subtitle: subtitle
    });
  }

  onEnemySpawned() {
    this.enemiesSpawned += 1;
    this.emitUpdate();
  }

  onEnemyDefeated() {
    this.enemiesDefeated += 1;
    const config = this.getWaveConfig();
    const isWaveCleared = this.enemiesDefeated >= config.count;

    if (isWaveCleared) {
      this.isWaveActive = false;
      this.isIntermission = true;
    }

    this.emitUpdate();
    return { isWaveCleared, remainingEnemies: Math.max(0, config.count - this.enemiesDefeated) };
  }

  nextWave() {
    if (this.currentWave < this.totalWaves) {
      this.currentWave += 1;
      this.startWave();
      return true;
    }
    return false;
  }

  emitUpdate() {
    const config = this.getWaveConfig();
    const remainingEnemies = Math.max(0, config.count - this.enemiesDefeated);

    EventBus.emit('wave-updated', {
      currentWave: this.currentWave,
      totalWaves: this.totalWaves,
      totalEnemies: config.count,
      enemiesDefeated: this.enemiesDefeated,
      remainingEnemies: remainingEnemies,
      isWaveActive: this.isWaveActive,
      isIntermission: this.isIntermission,
      isBossWave: !!config.isBossWave
    });
  }
}
