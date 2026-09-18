import React, { useState, useEffect } from 'react';
import { EventBus } from '../game/EventBus';
import { audioManager } from '../game/systems/AudioManager';
import TouchControls from './TouchControls';

export default function GameUI() {
  const [sceneKey, setSceneKey] = useState('BootScene');
  const [activeModal, setActiveModal] = useState(null);

  const [audioState, setAudioState] = useState({
    soundEnabled: audioManager.soundEnabled,
    musicEnabled: audioManager.musicEnabled
  });

  const [stats, setStats] = useState({
    score: 0,
    highScore: 0,
    isNewHighScore: false,
    modaks: 0,
    vighnasRemoved: 0,
    highestCombo: 1,
    health: 100,
    maxHealth: 100,
    divineEnergy: 100,
    maxDivineEnergy: 100,
    combo: 1,
    comboRatio: 0
  });

  const [waveData, setWaveData] = useState({
    currentWave: 1,
    totalWaves: 6,
    remainingEnemies: 5,
    isIntermission: false,
    isBossWave: false
  });

  const [bossData, setBossData] = useState({
    active: false,
    hp: 500,
    maxHp: 500,
    phase: 1,
    name: 'MAHA VIGHNA - SUPREME OBSTACLE'
  });

  const [announcement, setAnnouncement] = useState(null);

  const [cooldowns, setCooldowns] = useState({
    trunkBlastReady: true,
    trunkBlastRatio: 1,
    vakratundaReady: true,
    vakratundaRatio: 1
  });

  useEffect(() => {
    const handleSceneChanged = (key) => setSceneKey(key);
    const handleStatsUpdated = (newStats) => setStats(newStats);
    const handleWaveUpdated = (newWave) => setWaveData(newWave);
    const handleBossStatsUpdated = (newBoss) => setBossData(newBoss);
    const handleCooldownsUpdated = (newCds) => setCooldowns(newCds);
    const handleAudioStateChanged = (newAudio) => setAudioState(newAudio);
    const handleWaveAnnouncement = (data) => {
      setAnnouncement(data);
      setTimeout(() => setAnnouncement(null), 2800);
    };

    const handleOpenModal = (modalName) => setActiveModal(modalName);

    EventBus.on('scene-changed', handleSceneChanged);
    EventBus.on('stats-updated', handleStatsUpdated);
    EventBus.on('wave-updated', handleWaveUpdated);
    EventBus.on('boss-stats-updated', handleBossStatsUpdated);
    EventBus.on('cooldowns-updated', handleCooldownsUpdated);
    EventBus.on('audio-state-changed', handleAudioStateChanged);
    EventBus.on('wave-announcement', handleWaveAnnouncement);
    EventBus.on('open-modal', handleOpenModal);

    return () => {
      EventBus.off('scene-changed', handleSceneChanged);
      EventBus.off('stats-updated', handleStatsUpdated);
      EventBus.off('wave-updated', handleWaveUpdated);
      EventBus.off('boss-stats-updated', handleBossStatsUpdated);
      EventBus.off('cooldowns-updated', handleCooldownsUpdated);
      EventBus.off('audio-state-changed', handleAudioStateChanged);
      EventBus.off('wave-announcement', handleWaveAnnouncement);
      EventBus.off('open-modal', handleOpenModal);
    };
  }, []);

  const healthPercent = Math.max(0, Math.min(100, (stats.health / stats.maxHealth) * 100));
  const energyPercent = Math.max(0, Math.min(100, (stats.divineEnergy / stats.maxDivineEnergy) * 100));
  const comboRatioPercent = Math.max(0, Math.min(100, stats.comboRatio * 100));
  const bossHpPercent = Math.max(0, Math.min(100, (bossData.hp / bossData.maxHp) * 100));

  return (
    <>
      {/* Gameplay HUD Layer (Only visible during GameScene) */}
      {sceneKey === 'GameScene' && (
        <div className="game-hud-overlay">
          {/* LEFT: ❤️ Health Bar */}
          <div className="hud-card left-hud-card">
            <div className="hud-label">
              <span>❤️ Health</span>
              <span className="gauge-text">{stats.health} HP</span>
            </div>
            <div className="gauge-bar-container">
              <div 
                className="gauge-fill health-fill" 
                style={{ 
                  width: `${healthPercent}%`,
                  backgroundColor: healthPercent > 50 ? '#00E676' : healthPercent > 25 ? '#FFD600' : '#FF1744' 
                }} 
              />
            </div>
          </div>

          {/* TOP: Score | Wave | High Score | Audio Toggles */}
          <div className="hud-top-bar">
            <div className="hud-card top-stat-card">
              <span className="stat-label">SCORE</span>
              <span className="stat-value gold">{stats.score.toLocaleString()}</span>
            </div>

            <div className="hud-card top-stat-card wave-card">
              <span className="stat-label">WAVE</span>
              <span className="stat-value">{waveData.currentWave} / {waveData.totalWaves}</span>
            </div>

            <div className="hud-card top-stat-card">
              <span className="stat-label">👑 HIGH SCORE</span>
              <span className="stat-value orange">{stats.highScore.toLocaleString()}</span>
            </div>

            {/* Audio Toggle Controls */}
            <div className="audio-toggles-bar">
              <button 
                className={`audio-btn ${audioState.soundEnabled ? 'on' : 'off'}`}
                onClick={() => audioManager.toggleSound()}
                title="Toggle Sound Effects"
              >
                {audioState.soundEnabled ? '🔊 SFX' : '🔇 SFX'}
              </button>

              <button 
                className={`audio-btn ${audioState.musicEnabled ? 'on' : 'off'}`}
                onClick={() => audioManager.toggleMusic()}
                title="Toggle Background Music"
              >
                {audioState.musicEnabled ? '🎵 BGM' : '🔇 BGM'}
              </button>
            </div>
          </div>

          {/* RIGHT: 🍬 Modaks | ⚡ Divine Energy */}
          <div className="hud-card right-hud-card">
            <div className="right-stat-row">
              <span className="hud-icon">🍬</span>
              <div className="right-stat-info">
                <span className="hud-label">Modaks</span>
                <span className="hud-value">{stats.modaks}</span>
              </div>
            </div>

            <div className="right-stat-row energy-row">
              <span className="hud-icon">⚡</span>
              <div className="right-stat-info">
                <div className="hud-label">
                  <span>Energy</span>
                  <span className="gauge-text">{stats.divineEnergy} DE</span>
                </div>
                <div className="gauge-bar-container energy-mini-bar">
                  <div className="gauge-fill energy-fill" style={{ width: `${energyPercent}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* CENTER OVERLAYS: Boss Bar & Wave Banner & Combo Badge */}
          <div className="center-hud-container">
            {bossData.active && (
              <div className="boss-hud-card">
                <div className="boss-header-row">
                  <span className="boss-title">👹 {bossData.name}</span>
                  <span className={`boss-phase-badge phase-${bossData.phase}`}>
                    {bossData.phase === 1 ? 'PHASE 1' : bossData.phase === 2 ? 'PHASE 2 (ENRAGED)' : 'PHASE 3 (FINAL FRENZY)'}
                  </span>
                </div>
                <div className="boss-hp-bar-container">
                  <div className="boss-hp-bar-fill" style={{ width: `${bossHpPercent}%` }} />
                </div>
                <div className="boss-hp-text">{bossData.hp} / {bossData.maxHp} HP</div>
              </div>
            )}

            {stats.combo > 1 && (
              <div className="combo-badge-container">
                <div className="combo-badge-text">🔥 COMBO x{stats.combo}!</div>
                <div className="combo-timer-bar-bg">
                  <div className="combo-timer-bar-fill" style={{ width: `${comboRatioPercent}%` }} />
                </div>
              </div>
            )}

            {announcement && (
              <div className="wave-banner-overlay">
                <div className="wave-banner-content">
                  <h1 className="wave-banner-title">{announcement.text}</h1>
                  <p className="wave-banner-subtitle">{announcement.subtitle}</p>
                </div>
              </div>
            )}

            {/* Bottom Floating Skill Action Cards */}
            <div className="skills-bar-bottom">
              <div className={`skill-card ${cooldowns.trunkBlastReady ? 'ready' : 'cooldown'}`}>
                <div className="skill-key">[ E ]</div>
                <div className="skill-info">
                  <span className="skill-name">Trunk Blast</span>
                  <span className="skill-desc">Directional Cone</span>
                </div>
                {!cooldowns.trunkBlastReady && (
                  <div className="cooldown-overlay" style={{ height: `${(1 - cooldowns.trunkBlastRatio) * 100}%` }} />
                )}
              </div>

              <div className={`skill-card special ${cooldowns.vakratundaReady ? 'ready' : 'cooldown'}`}>
                <div className="skill-key">[ Q ]</div>
                <div className="skill-info">
                  <span className="skill-name">Vakratunda</span>
                  <span className="skill-desc">360° Shockwave (25 DE)</span>
                </div>
                {!cooldowns.vakratundaReady && (
                  <div className="cooldown-overlay" style={{ height: `${(1 - cooldowns.vakratundaRatio) * 100}%` }} />
                )}
              </div>
            </div>
          </div>

          {/* Touch Controls Overlay for Mobile Devices */}
          <TouchControls />
        </div>
      )}

      {/* HOW TO PLAY MODAL (Formatted per QA Audit Prompt) */}
      {activeModal === 'how-to-play' && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h2>🎮 HOW TO PLAY</h2>
              <button className="close-btn" onClick={() => setActiveModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="guide-grid">
                <div className="guide-item">
                  <span className="guide-label">MOVE</span>
                  <span className="guide-value">A / D &nbsp;or&nbsp; ← / →</span>
                </div>

                <div className="guide-item">
                  <span className="guide-label">JUMP</span>
                  <span className="guide-value">SPACE &nbsp;or&nbsp; W &nbsp;or&nbsp; ↑</span>
                </div>

                <div className="guide-item">
                  <span className="guide-label">TRUNK BLAST</span>
                  <span className="guide-value">[ E ] &nbsp;(Short Cone Wave)</span>
                </div>

                <div className="guide-item">
                  <span className="guide-label">VAKRATUNDA STRIKE</span>
                  <span className="guide-value">[ Q ] &nbsp;(360° Divine Shockwave)</span>
                </div>

                <div className="guide-item">
                  <span className="guide-label">COLLECT</span>
                  <span className="guide-value">🍬 MODAKS (+50 Points & +15 DE)</span>
                </div>

                <div className="guide-item">
                  <span className="guide-label">SURVIVE</span>
                  <span className="guide-value">👹 VIGHNAS & MAHA VIGHNA BOSS</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-action-btn" onClick={() => setActiveModal(null)}>CLOSE GUIDE</button>
            </div>
          </div>
        </div>
      )}

      {/* CREDITS MODAL */}
      {activeModal === 'credits' && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h2>🏆 GAME CREDITS</h2>
              <button className="close-btn" onClick={() => setActiveModal(null)}>✕</button>
            </div>
            <div className="modal-body credits-body">
              <h3>GANESHA VS VIGHNAS</h3>
              <p className="credits-subtitle">Ganesh Chaturthi Game Design Contest Entry</p>
              <hr />
              <p><strong>Game Concept & Design:</strong> Lead Developer</p>
              <p><strong>Engine & Tech Stack:</strong> React 18, Vite 5, Phaser 3 (Arcade Physics)</p>
              <p><strong>Audio Architecture:</strong> Central AudioManager (Web Audio API Synth BGM & SFX)</p>
              <p><strong>Art Style:</strong> Original Vector Canvas Indian Festival Aesthetic</p>
              <p className="blessing-text">🪔 <em>Ganpati Bappa Morya! May all obstacles be removed!</em> 🪔</p>
            </div>
            <div className="modal-footer">
              <button className="modal-action-btn" onClick={() => setActiveModal(null)}>CLOSE</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
