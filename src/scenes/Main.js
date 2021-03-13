import Phaser, { Scene } from 'phaser';

import bat from '../assets/images/bat.png';
import pipeTop from '../assets/images/pipe-top.png';
import pipeBottom from '../assets/images/pipe-bottom.png';
import background from '../assets/images/background.png';

class MainScene extends Scene {
    constructor() {
        super('MainScene');
    }
    preload() {
        this.load.image('bat', bat);
        this.load.image('pipeTop', pipeTop);
        this.load.image('pipeBottom', pipeBottom);
        this.load.image('background', background);
    }
    create() {
        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background');

        this.bat = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'bat');

        this.physics.add.existing(this.bat);

        this.pipes = this.physics.add.group();
        this.counters = this.physics.add.group();

        this.bat.body.setAllowGravity(true);
        this.bat.body.setCollideWorldBounds(true);

        this.physics.add.collider(this.bat, this.pipes, this.endGame, null, this);
        this.physics.add.overlap(this.bat, this.counters, this.updateScore, null, this);

        this.score = this.add.text(20, 20, '0', { font: '32px Arial', fill: '#00ff00' });
        this.score.setDepth(1);

        this.bat.setDataEnabled();
        this.bat.data.set('score', 0);

        this.bat.on('changedata', () => {
            this.score.setText(this.bat.data.get('score'));
        });

        this.makePipe();

        this.time.addEvent({ delay: 1500, callback: this.makePipe, callbackScope: this, loop: true });

        this.input.on('pointerdown', () => {
            this.bat.body.setVelocityY(-750);
        });
    }
    update() {
        this.pipes.children.iterate((pipe) => {
            if (typeof pipe !== 'undefined') {
                if (pipe.x > -100) {
                    return pipe.body.setVelocityX(-150);
                }
                pipe.destroy();
            }
        });
        this.counters.children.iterate((pipe) => {
            pipe.body.setVelocityX(-150);
        });
    }
    makePipe() {
        const vCenter = this.cameras.main.height / 2;
        const random = Phaser.Math.Between(-150, 150);

        const topY = vCenter - 300 + random;
        const bottomY = vCenter + 300 + random;

        const pipeTop = this.pipes.create(this.cameras.main.width + 100, topY, 'pipeTop');
        pipeTop.body.setAllowGravity(false);

        const pipeBottom = this.pipes.create(this.cameras.main.width + 100, bottomY, 'pipeBottom');
        pipeBottom.body.setAllowGravity(false);

        const counter = this.add.line(this.cameras.main.width + 100, vCenter + random, 0, 0, 0, 300, 0xff0000);
        this.counters.add(counter);

        counter.body.setAllowGravity(false);
        counter.setVisible(false);
    }
    endGame() {
        this.physics.pause();
        this.bat.stop();
    }
    updateScore(bat, counter) {
        counter.destroy();
        this.bat.data.inc('score');
    }
}

export { MainScene };
