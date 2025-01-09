import { Scene } from 'phaser';

export class RocketBoostButton {
    private scene: Scene;
    private button: Phaser.GameObjects.Text;
    private description: Phaser.GameObjects.Text;
    private hasRocketBoost: boolean = false;

    constructor(scene: Scene, x: number, y: number) {
        this.scene = scene;
        
        // 创建按钮
        this.button = scene.add.text(x, y, 'Check Rocket Boost', {
            fontSize: '24px',
            color: '#000000',
            backgroundColor: '#ffffff',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive();

        // 添加说明文字
        this.description = scene.add.text(x, y + 40, 'Complete ShieldLayer mint to get\n10 seconds rocket boost at start', {
            fontSize: '16px',
            color: '#666666',
            align: 'center'
        }).setOrigin(0.5);

        // 添加按钮交互
        this.setupButtonInteractions();
    }

    private setupButtonInteractions() {
        this.button.on('pointerover', () => this.button.setStyle({ color: '#ff0000' }));
        this.button.on('pointerout', () => this.button.setStyle({ color: '#000000' }));
        this.button.on('pointerdown', this.checkRocketBoost.bind(this));
    }

    private async checkRocketBoost() {
        try {
            this.button.setStyle({ backgroundColor: '#cccccc' });
            this.button.setText('Checking...');
            
            const response = await fetch('https://api.shieldlayer.xyz/shield-layer/api/transaction/SEPOLIA/mintAndStake?address=0x68020223562Ac021C21B2352147D7A28c240080F');
            const data = await response.json();
            
            if (data.data?.result === true) {
                this.hasRocketBoost = true;
                this.button.setText('Rocket Boost Ready!');
                this.button.setStyle({ backgroundColor: '#90EE90' });
            } else {
                this.button.setText('Not Eligible');
                this.button.setStyle({ backgroundColor: '#ffcccc' });
            }
        } catch (error) {
            console.error('Error checking rocket boost:', error);
            this.button.setText('Check Failed');
            this.button.setStyle({ backgroundColor: '#ffcccc' });
        }
    }

    public getHasRocketBoost(): boolean {
        return this.hasRocketBoost;
    }

    public destroy() {
        this.button.destroy();
        this.description.destroy();
    }
} 