import { Scene } from 'phaser';

export class Penguin extends Phaser.Physics.Arcade.Sprite {
    private jumpVelocity: number = -400;
    private moveSpeed: number = 300;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'penguin');
        
        // 添加到场景
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // 设置物理属性
        this.setBounce(0.2);
        this.setSize(40, 50); // 调整碰撞箱大小

        // 获取键盘输入
        this.cursors = scene.input.keyboard!.createCursorKeys();
    }

    update() {
        // 左右移动控制
        if (this.cursors.left.isDown) {
            this.setVelocityX(-this.moveSpeed);
            this.setFlipX(true);
        } else if (this.cursors.right.isDown) {
            this.setVelocityX(this.moveSpeed);
            this.setFlipX(false);
        } else {
            this.setVelocityX(0);
        }

        // 当企鹅向上移动时，检查是否超出了屏幕上边界
        if (this.y < this.scene.cameras.main.height * 0.3) {
            // 发出事件通知场景移动平台和背景
            this.scene.events.emit('playerClimbing', this.y);
        }
    }

    jump() {
        const body = this.body as Phaser.Physics.Arcade.Body;
        // 移除 touching.down 检查，只检查是否在下落或静止
        if (body.velocity.y >= 0) {
            this.setVelocityY(this.jumpVelocity);
        }
    }
} 