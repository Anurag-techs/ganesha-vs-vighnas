import Phaser from 'phaser';

export default class Vighna extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, moveSpeed = 110, maxHp = 30) {
    super(scene, x, y, 'vighna_enemy');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setBounce(0.2);
    this.setDragX(400);
    this.setDepth(9);

    this.body.setSize(44, 44);
    this.body.setOffset(5, 5);

    // Dynamic Scaled Combat Stats
    this.hp = maxHp;
    this.maxHp = maxHp;
    this.moveSpeed = moveSpeed;
    this.isHit = false;
    this.isDefeated = false;

    // Breathing pulse tween
    this.scene.tweens.add({
      targets: this,
      scaleY: 1.08,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  update(time, delta, playerX, playerY) {
    if (this.isHit || this.isDefeated || !this.body) return;

    if (playerX !== undefined) {
      const distanceX = playerX - this.x;

      if (Math.abs(distanceX) > 15) {
        if (distanceX > 0) {
          this.setVelocityX(this.moveSpeed);
          this.setFlipX(false);
        } else {
          this.setVelocityX(-this.moveSpeed);
          this.setFlipX(true);
        }
      } else {
        this.setVelocityX(0);
      }
    }
  }

  takeDamage(amount, sourceX) {
    if (!this.active || this.isDefeated) return false;

    this.hp -= amount;

    if (this.hp <= 0) {
      this.defeat();
      return true;
    }

    if (this.isHit) return false;
    this.isHit = true;

    const knockDir = this.x >= sourceX ? 1 : -1;
    this.setVelocityX(knockDir * 320);
    this.setVelocityY(-180);

    this.setTint(0xFF0000);
    this.scene.showFloatingText(this.x, this.y - 30, `-${amount}`, '#FF1744');

    if (this.scene.vighnaEmitter) {
      this.scene.vighnaEmitter.explode(10, this.x, this.y);
    }

    this.scene.time.delayedCall(300, () => {
      if (this.active && !this.isDefeated) {
        this.clearTint();
        this.isHit = false;
      }
    });

    return false;
  }

  defeat() {
    if (!this.active || this.isDefeated) return;
    this.isDefeated = true;

    if (this.scene.goldEmitter) {
      this.scene.goldEmitter.explode(16, this.x, this.y);
    }
    
    const result = this.scene.scoreManager.addVighnaDefeated();
    const comboText = result.combo > 1 ? ` 🔥 COMBO x${result.combo}!` : '';
    this.scene.showFloatingText(this.x, this.y - 25, `+${result.points}${comboText}`, '#FFD700');

    // Notify scene of enemy defeat for wave progression
    if (this.scene.handleVighnaDefeated) {
      this.scene.handleVighnaDefeated();
    }

    this.destroy();
  }
}
