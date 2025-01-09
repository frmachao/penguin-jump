import { Platform } from './Platform';
import { Scene } from 'phaser';

export class RegularPlatform extends Platform {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'regular-platform');
        this.platformType = 'regular';
    }
} 