import { Game } from 'phaser';
import { GameConfig } from './config/GameConfig';
import { LoadingScene } from './scenes/LoadingScene';
import { MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene';
import { GameOverScene } from './scenes/GameOverScene';
import { setupControls } from './controls';

window.addEventListener('load', () => {
    const game = new Game(GameConfig);
    
    game.scene.add('Loading', LoadingScene);
    game.scene.add('Menu', MenuScene);
    game.scene.add('Game', GameScene);
    game.scene.add('GameOver', GameOverScene);
    
    game.scene.start('Loading');

    // 设置控制器
    setupControls();
});
