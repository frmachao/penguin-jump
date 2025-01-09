import { Platform } from './Platform';
import { Scene } from 'phaser';

export class DestructivePlatform extends Platform {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'destructive-platform');
        this.platformType = 'destructive';
    }

    handleCollision(): void {
        // 播放破坏音效
        this.scene.sound.play('destroy', { volume: 0.4 });
        // 破坏平台不会让玩家跳跃，而是会立即消失
        this.destroy();
    }
} 