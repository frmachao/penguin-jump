import { Scene } from 'phaser';
import { Penguin } from '../objects/Penguin';
import { Platform } from '../objects/Platform';
import { RegularPlatform } from '../objects/RegularPlatform';
import { DisappearingPlatform } from '../objects/DisappearingPlatform';
import { DestructivePlatform } from '../objects/DestructivePlatform';
import { GameSettings } from '../config/GameSettings';

export class GameScene extends Scene {
    private score: number = 0;
    private scoreText!: Phaser.GameObjects.Text;
    private penguin!: Penguin;
    private platforms!: Phaser.Physics.Arcade.StaticGroup;
    private lastPlatformY: number = 0;
    private highestY: number = 0;
    private bgm!: Phaser.Sound.BaseSound;
    private hasRocketBoost: boolean = false;
    private rocketBoostTimer!: Phaser.Time.TimerEvent;

    init(data: { hasRocketBoost?: boolean }) {
        this.hasRocketBoost = data.hasRocketBoost || false;
    }

    constructor() {
        super({ key: 'Game' });
    }

    create() {
        // 创建可重复的背景
        const background = this.add.tileSprite(
            200,    // x 位置
            300,    // y 位置
            400,    // 宽度
            600,    // 高度
            'background'
        );
        background.setScrollFactor(0); // 背景固定在相机视图中

        // 创建平台组
        this.platforms = this.physics.add.staticGroup();

        // 添加初始平台
        this.createInitialPlatforms();

        // 创建企鹅并放置在起始平台上
        const startPlatform = new RegularPlatform(this, 200, 500);
        this.platforms.add(startPlatform);
        this.penguin = new Penguin(this, 200, 460);
        
        // 设置世界边界，只限制水平方向
        this.physics.world.setBounds(0, -Infinity, 400, Infinity);
        // 只限制水平移动
        const body = this.penguin.body as Phaser.Physics.Arcade.Body;
        body.setCollideWorldBounds(true);
        body.onWorldBounds = true;

        // 给企鹅一个初始的向上跳跃
        this.penguin.jump();

        // 添加碰撞检测
        this.physics.add.collider(
            this.penguin, 
            this.platforms, 
            this.handlePlatformCollision, 
            () => true, // 始终允许碰撞，具体逻辑由平台类处理
            this
        );

        // 添加分数显示
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            color: '#000'
        });

        // 监听企鹅爬升事件
        this.events.on('playerClimbing', this.handlePlayerClimbing, this);

        // 初始化最高高度为企鹅的起始位置
        this.highestY = 460;

        // 添加重启游戏的键盘监听
        this.input.keyboard!.on('keydown-R', () => {
            // 停止当前的背景音乐
            if (this.bgm) {
                this.bgm.stop();
            }
            this.scene.restart();
        });

        // 检查是否已经存在背景音乐
        if (!this.sound.get('bgm')) {
            // 只在第一次创建背景音乐
            this.bgm = this.sound.add('bgm', { 
                loop: true,
                volume: 0.5
            });
        } else {
            // 获取已存在的背景音乐
            this.bgm = this.sound.get('bgm');
        }

        // 如果背景音乐没有在播放，则开始播放
        if (!this.bgm.isPlaying) {
            this.bgm.play();
        }

        // 如果有火箭加速能力，启动火箭模式
        if (this.hasRocketBoost) {
            this.startRocketBoost();
        }
    }

    update() {
        this.penguin.update();

        // 更新背景的 tilePosition，创建无限滚动效果
        const background = this.children.list[0] as Phaser.GameObjects.TileSprite;
        background.tilePositionY = this.cameras.main.scrollY * 0.6;

        // 检查企鹅是否掉出相机视口底部
        const penguinViewportY = this.penguin.y - this.cameras.main.scrollY;
        const body = this.penguin.body as Phaser.Physics.Arcade.Body;

        // 当企鹅正在下落且超出视口底部一定距离时触发游戏结束
        if (body.velocity.y > 0 && penguinViewportY > this.cameras.main.height + 100) {
            this.gameOver();
        }

        // 如果在火箭模式中，保持固定上升速度
        if (this.hasRocketBoost) {
            const body = this.penguin.body as Phaser.Physics.Arcade.Body;
            body.setVelocityY(GameSettings.velocities.rocketBoost);
        }
    }

    private createInitialPlatforms() {
        // 创建起始平台上方的随机平台
        for (let i = 0; i < 5; i++) {
            this.createPlatform(
                Phaser.Math.Between(50, 350),
                this.cameras.main.height - 200 - i * 150 // 从起始平台上方开始生成
            );
        }
    }

    private createPlatform(x: number, y: number) {
        const platformType = Math.random();
        let platform: Platform;

        if (platformType > 0.8) {
            platform = new DestructivePlatform(this, x, y);
        } else if (platformType > 0.6) {
            platform = new DisappearingPlatform(this, x, y);
        } else {
            platform = new RegularPlatform(this, x, y);
        }

        this.platforms.add(platform);
        this.lastPlatformY = y;
    }

    private handlePlatformCollision(player: any, platform: any) {
        const typedPlatform = platform as Platform;
        const penguin = player as Penguin;
        
        // 直接调用平台的碰撞处理
        typedPlatform.handleCollision(penguin);
    }

    private handlePlayerClimbing(playerY: number) {
        const body = this.penguin.body as Phaser.Physics.Arcade.Body;
        
        // 只有企鹅在上升时才移动相机
        if (body.velocity.y < 0) {
            // 计算目标相机位置，让企鹅保持在屏幕中间偏上的位置
            const targetCameraY = playerY - this.cameras.main.height * 0.3;
            // 使用缓动效果移动相机，速度与企鹅跳跃速度相关
            const deltaY = (this.cameras.main.scrollY - targetCameraY) * 0.1;
            this.cameras.main.scrollY -= deltaY;
            
            // 计算企鹅的世界坐标（考虑相机滚动）
            const penguinWorldY = this.penguin.y + this.cameras.main.scrollY;
            
            // 只有超过历史最高点时才更新分数
            if (penguinWorldY < this.highestY) {
                const heightDiff = Math.abs(this.highestY - penguinWorldY);
                this.score += Math.floor(heightDiff);
                this.scoreText.setText(`Score: ${this.score}`);
                this.highestY = penguinWorldY;
            }
            
            this.scoreText.setScrollFactor(0);
        }

        // 生成新平台（添加限制）
        const minPlatformSpacing = 100;
        while (this.lastPlatformY > this.cameras.main.scrollY - minPlatformSpacing) {
            const newY = this.lastPlatformY - Phaser.Math.Between(100, 150);
            // 确保不会生成太多平台
            if (Math.abs(newY - this.cameras.main.scrollY) < this.cameras.main.height * 2) {
                this.createPlatform(
                    Phaser.Math.Between(50, 350),
                    newY
                );
            }
        }
    }

    private gameOver() {
        // 清理火箭模式计时器
        if (this.rocketBoostTimer) {
            this.rocketBoostTimer.destroy();
        }

        // 停止背景音乐
        if (this.bgm) {
            this.bgm.stop();
        }
        // 播放游戏结束音效
        this.sound.play('gameover');
        // 传递分数到游戏结束场景
        this.scene.start('GameOver', { score: this.score });
    }

    private startRocketBoost() {
        const body = this.penguin.body as Phaser.Physics.Arcade.Body;
        
        // 设置持续上升的速度
        body.setGravityY(-this.physics.world.gravity.y); // 抵消重力
        body.setVelocityY(GameSettings.velocities.rocketBoost); // 设置固定上升速度

        // 停止当前的背景音乐
        if (this.bgm) {
            this.bgm.stop();
        }

        // 播放火箭音效作为BGM
        this.bgm = this.sound.add('rocket', { 
            loop: true,
            volume: 0.5 
        });
        this.bgm.play();

        // 设置10秒计时器
        this.rocketBoostTimer = this.time.addEvent({
            delay: 10000,
            callback: () => {
                this.hasRocketBoost = false;
                // 恢复正常重力
                body.setGravityY(0);
                // 不设置速度，让企鹅自然下落

                // 停止火箭音效，恢复正常BGM
                this.bgm.stop();
                this.bgm = this.sound.add('bgm', { 
                    loop: true,
                    volume: 0.5 
                });
                this.bgm.play();
            },
            callbackScope: this
        });
    }
} 