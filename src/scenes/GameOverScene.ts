import { Scene } from 'phaser';
import { RocketBoostButton } from '../components/RocketBoostButton';

export class GameOverScene extends Scene {
    private score: number;
    private rocketButton!: RocketBoostButton;

    constructor() {
        super({ key: 'GameOver' });
        this.score = 0;
    }

    init(data: { score: number }) {
        this.score = data.score;
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 添加 Game Over 文本
        this.add.text(width / 2, height / 3, 'Game Over', {
            fontSize: '64px',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // 显示最终得分
        this.add.text(width / 2, height / 2, `Score: ${this.score}`, {
            fontSize: '32px',
            color: '#000000'
        }).setOrigin(0.5);

        // 添加重新开始按钮
        const restartButton = this.add.text(width / 2, height * 2/3, 'Restart', {
            fontSize: '32px',
            color: '#000000',
            backgroundColor: '#ffffff',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive();

        // 添加火箭能力检查按钮
        this.rocketButton = new RocketBoostButton(this, width / 2, height * 2/3 + 60);

        // 修改重启按钮的点击处理
        restartButton.on('pointerdown', () => {
            this.scene.start('Game', { hasRocketBoost: this.rocketButton.getHasRocketBoost() });
        });
    }
} 