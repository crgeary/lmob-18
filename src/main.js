import Phaser from 'phaser';
import { MainScene } from './scenes/Main';

import './main.css';

new Phaser.Game({
    type: Phaser.AUTO,
    width: 360,
    height: 640,
    scene: MainScene,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 2000,
            },
        },
    },
});
