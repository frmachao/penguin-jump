import { Types } from 'phaser';

export const GameConfig: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 400,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 300 },
            debug: false
        }
    },
    backgroundColor: '#FFFFFF',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
}; 