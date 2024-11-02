class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
    }

    preload() {
        this.load.image('introImage', 'assets/intro.png'); // Load your intro image here
    }

    create() {
        // Create the intro image but don't display it yet
        const introImage = this.add.image(450, 50, 'introImage').setOrigin(0, 0).setAlpha(0);

        // Create a tween for the fade-in effect
        this.tweens.add({
            targets: introImage,
            alpha: 1, // Fade to fully visible
            duration: 2000, // Duration in milliseconds
            ease: 'Power2', // Easing function
            onComplete: () => {
                // Optional: add any actions after the fade-in completes
            }
        });

        // Display the text message
        const introMessage = this.add.text(650, 350, 'Press Enter to continue', {
            font: '32px Barlow Condensed',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0, 0);

        // Listen for the Enter key
        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('GameScene'); // Transition to GameScene
        });
    }

    update() {
        // Optional: Add any update logic here if needed
    }
}


class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.image('bgImage' , './assets/background.png');
        this.load.image('basePlatform', './assets/platform.png');
        this.load.image('p1', './assets/platform.png');
        this.load.image('p2', './assets/platform.png');
        this.load.image('p3', './assets/platform.png');
        this.load.image('ball', './assets/ball.png');
        this.load.image('pipe', './assets/pipe.png');
    }

    create() {
        var bg =this.add.image(0,0,'bgImage').setOrigin(0,0);
        bg.displayWidth = this.sys.canvas.width;
        bg.displayHeight = this.sys.canvas.height;
        this.platforms = this.physics.add.staticGroup();
        this.pipe = this.physics.add.staticImage(1450, 650, 'pipe');

        this.platforms.create(600, 700, 'basePlatform');
        this.platforms.create(-500, 220, 'p1');
        this.platforms.create(1300, 350, 'p2');
        this.platforms.create(-500, 500, 'p3');

        const textMessage = this.add.text(400, 300, 'LVL1        (Use ↑ ↓ ← → keys to move)', {
            font: '40px Barlow Condensed',
            fill: '#ffffff',
            align: 'left'
        });
        textMessage.setPosition(50, 50);

        this.mainBall = this.physics.add.sprite(100, 0, 'ball');
        this.mainBall.setBounce(0.4);
        this.mainBall.setGravity = true;
        this.mainBall.setCollideWorldBounds(true);

        this.physics.add.collider(this.mainBall, this.platforms);
        this.physics.add.collider(this.mainBall, this.pipe, this.onBallHitPipe, null, this);
    }

    onBallHitPipe(mainBall, pipe) {
        console.log('overlapping');
        pipe.setDepth(1);
        this.scene.start('WinScene');
    }

    update() {
        const cursors = this.input.keyboard.createCursorKeys();

        if (cursors.left.isDown) {
            this.mainBall.setVelocityX(-760);
        } else if (cursors.right.isDown) {
            this.mainBall.setVelocityX(760);
        } else {
            this.mainBall.setVelocityX(0);
        }

        if (cursors.up.isDown && this.mainBall.body.touching.down) {
            this.mainBall.setVelocityY(-700);
        }
    }
}

class WinScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WinScene' });
    }

    create() {
        const winMessage = this.add.text(260,340 , 'You Win! Press Enter to continue to the next level.', {
            font: '64px Barlow Condensed',
            fill: '#ffffff',
            align: 'left'
        }).setOrigin(0,0);

        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('SecondGameScene'); // Transition to SecondGameScene
        });
    }

    update() {}
}
class SecondGameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SecondGameScene' });
    }

    preload() {
        this.load.image('basePlatform', 'assets/platform.png');
        this.load.image('bgImage', './assets/background.png');
        this.load.image('p1', 'assets/platform.png');
        this.load.image('p2', 'assets/platform.png');
        this.load.image('p3', 'assets/platform.png');
        this.load.image('ball', 'assets/ball.png');
        this.load.image('pipe1', 'assets/pipe_new.png');
        this.load.image('boxingGlove', 'assets/boxing_final.png');
        this.load.image('invisiblePipe', 'assets/invis_obj.png');
    }

    create() {
        var bg = this.add.image(0, 0, 'bgImage').setOrigin(0, 0);
        bg.displayWidth = this.sys.canvas.width;
        bg.displayHeight = this.sys.canvas.height;

        this.platforms = this.physics.add.staticGroup();
        this.pipe = this.physics.add.staticImage(1400, 620, 'pipe1');
        this.pipe.setDepth(1);

        // Create the invisible pipe
        this.invisiblePipe = this.physics.add.staticImage(1400, 545, 'invisiblePipe');
        this.invisiblePipe.setAlpha(0);
        this.invisiblePipe.setSize(50, 50);

        this.platforms.create(600, 700, 'basePlatform');
        this.platforms.create(-500, 220, 'p1');
        this.platforms.create(1300, 350, 'p2');
        this.platforms.create(-500, 500, 'p3');

        this.boxingGlove = this.physics.add.image(1650, 500, 'boxingGlove');
        this.boxingGlove.setCollideWorldBounds(true);
        this.boxingGlove.body.allowGravity = false;

        const textMessage = this.add.text(400, 300, 'LVL 2  ', {
            font: '40px Barlow Condensed',
            fill: '#ffffff',
            align: 'left'
        });
        textMessage.setPosition(30, 30);

        this.loseMessage = this.add.text(800, 300, 'Hahaha! You thought this was going to be that easy?', {
            font: 'bold 50px Barlow Condensed',
            fill: '#ff0000',
            align: 'center'
        }).setOrigin(0.5, 0.5).setAlpha(0); // Invisible initially

        this.mainBall = this.physics.add.sprite(100, 0, 'ball');
        this.mainBall.setBounce(0.4);
        this.mainBall.setCollideWorldBounds(true);

        this.physics.add.collider(this.mainBall, this.platforms);
        this.physics.add.collider(this.mainBall, this.pipe);
        this.physics.add.collider(this.mainBall, this.invisiblePipe, this.onBallHitInvisiblePipe, null, this);
    }

    onBallHitInvisiblePipe(mainBall, invisiblePipe) {
        console.log('Hit invisible pipe');
        this.boxingGlove.x = 1650; // Off-screen starting position
        this.boxingGlove.y = 500; // Fixed height for the glove

        this.tweens.add({
            targets: this.boxingGlove,
            x: 1400, // Target position for the glove
            duration: 10, // Quick move to simulate a punch
            ease: 'Elastic.Out', // Use Elastic easing for a spring effect
            onComplete: () => {
                mainBall.setVelocityX(-8000);
                mainBall.setBounce(0.5, 0.5);
                this.tweens.add({
                    targets: this.boxingGlove,
                    x: 1650, // Move glove back off-screen
                    duration: 200, // Quick retract
                    ease: 'Elastic.In' // Use Elastic easing for the return
                });

                // Show the lose message
                this.showLoseMessage();
            }
        });
    }

    showLoseMessage() {
        // Make the message visible and fade it in
        this.tweens.add({
            targets: this.loseMessage,
            alpha: 1,
            duration: 1000, // Fade in duration
            onComplete: () => {
                // After fade-in, set a timer to reload the scene
                this.time.delayedCall(1000, () => {
                    this.reloadLevel();
                });
            }
        });
    }

    reloadLevel() {
        // Reload the current scene
        this.scene.restart();
    }

    update() {
        const cursors = this.input.keyboard.createCursorKeys();

        if (cursors.left.isDown) {
            this.mainBall.setVelocityX(-960);
        } else if (cursors.right.isDown) {
            this.mainBall.setVelocityX(960);
        } else {
            this.mainBall.setVelocityX(0);
        }

        if (cursors.up.isDown && this.mainBall.body.touching.down) {
            this.mainBall.setVelocityY(-700);
        }
    }
}



const config = {
    type: Phaser.AUTO,
    width: 1800,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1200 },
            debug: false
        }
    },
    scene: [IntroScene , GameScene , WinScene ,SecondGameScene] // Added IntroScene here
};

const game = new Phaser.Game(config);
