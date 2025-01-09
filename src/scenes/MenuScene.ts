import { Scene } from 'phaser';
import { RocketBoostButton } from '../components/RocketBoostButton';

export class MenuScene extends Scene {
    private rocketButton!: RocketBoostButton;

    constructor() {
        super({ key: 'Menu' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 添加游戏标题
        this.add.text(width / 2, height / 3, 'Penguin Jump', {
            fontSize: '48px',
            color: '#000000'
        }).setOrigin(0.5);

        // 添加开始按钮
        const startButton = this.add.text(width / 2, height / 2, 'Start Game', {
            fontSize: '32px',
            color: '#000000',
            backgroundColor: '#ffffff',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive();

        // 添加火箭能力检查按钮
        this.rocketButton = new RocketBoostButton(this, width / 2, height * 2/3);

        // 添加按钮交互
        startButton.on('pointerover', () => startButton.setStyle({ color: '#ff0000' }));
        startButton.on('pointerout', () => startButton.setStyle({ color: '#000000' }));
        startButton.on('pointerdown', () => {
            this.scene.start('Game', { hasRocketBoost: this.rocketButton.getHasRocketBoost() });
        });
    }
} 