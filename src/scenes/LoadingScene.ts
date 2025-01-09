import { Scene } from 'phaser';

export class LoadingScene extends Scene {
    constructor() {
        super({ key: 'Loading' });
    }

    preload() {
        // 设置资源加载路径
        this.load.setPath('assets');

        // 加载游戏素材
        this.load.svg('penguin', 'penguin.svg');
        this.load.image('background', 'background.png');
        this.load.image('regular-platform', 'regular-platform.png');
        this.load.image('disappearing-platform', 'disappearing-platform.png');
        this.load.image('destructive-platform', 'destructive-platform.png');

        // 加载音频
        this.load.audio('bgm', 'bgm.mp3');
        this.load.audio('jump', 'jump.mp3');
        this.load.audio('disappear', 'disappear.mp3');
        this.load.audio('destroy', 'destroy.mp3');
        this.load.audio('gameover', 'gameover.mp3');
        this.load.audio('rocket', 'rocket.mp3');

        // 创建加载进度条
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 4, height / 2 - 30, width / 2, 50);
        
        // 添加加载文本
        const loadingText = this.add.text(width / 2, height / 2 - 50, 'loading...', {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // 监听加载进度
        this.load.on('progress', (value: number) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 4 + 10, height / 2 - 20, (width / 2 - 20) * value, 30);
        });

        // 加载完成后切换到菜单场景
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            this.scene.start('Menu');
        });
    }
} 