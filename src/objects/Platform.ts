import { Scene } from 'phaser';
import { GameSettings } from '../config/GameSettings';

export class Platform extends Phaser.Physics.Arcade.Sprite {
    protected platformType: string;

    constructor(scene: Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        
        // 添加到场景
        scene.add.existing(this);
        scene.physics.add.existing(this, true); // true 表示这是一个静态物体

        this.platformType = 'regular';
        
        // 设置平台的物理属性
        this.setImmovable(true);
        const body = this.body as Phaser.Physics.Arcade.StaticBody;
        body.checkCollision.down = false;  // 只允许从上方碰撞
        body.checkCollision.left = false;
        body.checkCollision.right = false;
        body.updateFromGameObject(); // 更新物理体
    }

    // 当玩家碰到平台时调用
    handleCollision(player: Phaser.Physics.Arcade.Sprite): void {
        const body = player.body as Phaser.Physics.Arcade.Body;       
        
        if (body.touching.down) {
            if (this.platformType !== 'destructive') {
                body.setVelocityY(GameSettings.velocities.normalJump);
                this.scene.sound.play('jump', { 
                    volume: 0.5,
                    seek: 1
                });
            } else {
                this.destroy();
            }
        }
    }

    // 获取平台类型
    getPlatformType(): string {
        return this.platformType;
    }
} 