import Vighna from './Vighna';

// 1. Basic Vighna (Balanced obstacle)
export class BasicVighna extends Vighna {
  constructor(scene, x, y) {
    super(scene, x, y, 110, 30);
    this.contactDamage = 20;
    this.baseScore = 100;
  }
}

// 2. Fast Vighna (Crimson sleek runner)
export class FastVighna extends Vighna {
  constructor(scene, x, y) {
    super(scene, x, y, 190, 20);
    this.setTexture('vighna_fast');
    this.contactDamage = 15;
    this.baseScore = 80;
    this.body.setSize(38, 38);
  }
}

// 3. Heavy Vighna (Dark obsidian horned brute)
export class HeavyVighna extends Vighna {
  constructor(scene, x, y) {
    super(scene, x, y, 65, 90);
    this.setTexture('vighna_heavy');
    this.contactDamage = 35;
    this.baseScore = 250;
    this.body.setSize(58, 58);
  }
}

// 4. Swarm Vighna (Small fast purple orb)
export class SwarmVighna extends Vighna {
  constructor(scene, x, y) {
    super(scene, x, y, 160, 15);
    this.setTexture('vighna_swarm');
    this.contactDamage = 10;
    this.baseScore = 60;
    this.setScale(0.85);
    this.body.setSize(26, 26);
  }
}
