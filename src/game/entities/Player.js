import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'ganesha_player');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Physics Properties
    this.setCollideWorldBounds(true);
    this.setBounce(0.05);
    this.setDragX(1200);
    this.setDepth(10);
    
    this.body.setSize(44, 70);
    this.body.setOffset(10, 8);

    // Movement Stats
    this.moveSpeed = 360;
    this.jumpForce = -560;
    this.facingRight = true;

    // Mobile Virtual Touch Flags
    this.touchLeft = false;
    this.touchRight = false;
    this.touchJumpTriggered = false;

    // Combat Cooldowns (in ms)
    this.trunkBlastCd = 600;
    this.vakratundaCd = 3500;
    this.lastTrunkBlast = 0;
    this.lastVakratunda = 0;

    // Keyboard bindings
    this.keys = scene.input.keyboard.addKeys({
      leftA: Phaser.Input.Keyboard.KeyCodes.A,
      rightD: Phaser.Input.Keyboard.KeyCodes.D,
      jumpW: Phaser.Input.Keyboard.KeyCodes.W,
      leftArrow: Phaser.Input.Keyboard.KeyCodes.LEFT,
      rightArrow: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      upArrow: Phaser.Input.Keyboard.KeyCodes.UP,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      attackE: Phaser.Input.Keyboard.KeyCodes.E,
      attackQ: Phaser.Input.Keyboard.KeyCodes.Q
    });

    // Idle Animation Tween
    this.idleTween = this.scene.tweens.add({
      targets: this,
      scaleY: 1.04,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  update(time, delta) {
    const isLeftPressed = this.keys.leftA.isDown || this.keys.leftArrow.isDown || this.touchLeft;
    const isRightPressed = this.keys.rightD.isDown || this.keys.rightArrow.isDown || this.touchRight;
    const isJumpPressed = Phaser.Input.Keyboard.JustDown(this.keys.jumpW) ||
                          Phaser.Input.Keyboard.JustDown(this.keys.upArrow) ||
                          Phaser.Input.Keyboard.JustDown(this.keys.space) ||
                          this.touchJumpTriggered;

    if (this.touchJumpTriggered) {
      this.touchJumpTriggered = false;
    }

    const isEPressed = Phaser.Input.Keyboard.JustDown(this.keys.attackE);
    const isQPressed = Phaser.Input.Keyboard.JustDown(this.keys.attackQ);

    // Horizontal Movement
    if (isLeftPressed) {
      this.setVelocityX(-this.moveSpeed);
      this.setFlipX(true);
      this.facingRight = false;
      this.setAngle(-4);
    } else if (isRightPressed) {
      this.setVelocityX(this.moveSpeed);
      this.setFlipX(false);
      this.facingRight = true;
      this.setAngle(4);
    } else {
      this.setVelocityX(0);
      this.setAngle(0);
    }

    // Jump Logic
    const isGrounded = this.body.blocked.down || this.body.touching.down;
    if (isJumpPressed && isGrounded) {
      this.setVelocityY(this.jumpForce);
      
      this.scene.tweens.add({
        targets: this,
        scaleX: 0.85,
        scaleY: 1.15,
        duration: 120,
        yoyo: true,
        ease: 'Quad.easeOut'
      });
    }

    // Keyboard Attack Triggers
    if (isEPressed) {
      this.scene.executeTrunkBlast(time);
    }

    if (isQPressed) {
      this.scene.executeVakratundaStrike(time);
    }
  }

  playAttackAnimation() {
    const forwardSurge = this.facingRight ? 15 : -15;
    this.scene.tweens.add({
      targets: this,
      x: this.x + forwardSurge,
      duration: 80,
      yoyo: true,
      ease: 'Quad.easeOut'
    });
  }

  playHitAnimation() {
    this.setTint(0xFF0000);
    
    this.scene.tweens.add({
      targets: this,
      alpha: 0.3,
      duration: 100,
      yoyo: true,
      repeat: 4,
      onComplete: () => {
        this.setAlpha(1);
        this.clearTint();
      }
    });
  }
}
