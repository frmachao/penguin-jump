import { Platform } from './Platform';
import { Scene } from 'phaser';

export class DisappearingPlatform extends Platform {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'disappearing-platform');
        this.platformType = 'disappearing';
    }

    handleCollision(player: Phaser.Physics.Arcade.Sprite): void {
        super.handleCollision(player);
        
        // 先播放消失音效
        this.scene.sound.play('disappear', { volume: 0.3 });
        
        // 添加消失动画
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 200,
            ease: 'Power1',
            onComplete: () => {
                this.destroy();
            }
        });
    }
} 