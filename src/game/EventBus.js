import Phaser from 'phaser';

// Global EventBus for communication between Phaser scenes and React components
export const EventBus = new Phaser.Events.EventEmitter();
