// Step 1: Define the Scene Class
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.image('basePlatform', 'assets/platform.png');
        this.load.image('p1', 'assets/platform.png');
        this.load.image('p2', 'assets/platform.png');
        this.load.image('p3', 'assets/platform.png');
        this.load.image('ball', 'assets/ball.png');
        this.load.image('pipe', 'assets/pipe.png');
    }

    create() {
        this.platforms = this.physics.add.staticGroup();
        this.pipe = this.physics.add.staticImage(1450, 650, 'pipe');
        
        this.platforms.create(600, 700, 'basePlatform');
        this.platforms.create(-500, 220, 'p1');
        this.platforms.create(1300, 350, 'p2');
        this.platforms.create(-500, 500, 'p3');
        
        const textMessage = this.add.text(400, 300, 'Use Up, Down, Left, Right keys to move!', {
            font: '32px Barlow Condensed',
            fill: '#ffffff',
            align: 'left'
        });
        textMessage.setPosition(600, 50);

        this.mainBall = this.physics.add.sprite(100, 0, 'ball');
        this.mainBall.setBounce(0.4);
        this.mainBall.setCollideWorldBounds(true);

        this.physics.add.collider(this.mainBall, this.platforms);
        this.isOverlapping = this.physics.add.overlap(this.mainBall, this.pipe, this.overlapCheck, null, this);
    }

    overlapCheck(mainBall, pipe) {
        console.log('overlapping');
        pipe.setDepth(1);
        this.scene.start('WinScene');
        this.isOverlapping.active = false; // Disable overlap checking
    }

    update() {
        if (!this.isInPipe) {
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
}


class WinScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WinScene' });
    }

    create() {
        const winMessage = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'You Win! Press Enter to continue to the next level.', {
            font: '64px Barlow Condensed',
            fill: '#00ff00',
            align: 'center'
        }).setOrigin(0.5);

        // Listen for the Enter key
        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('SecondGameScene'); // Transition to SecondGameScene
        });
    }

    update() {
        // Optional: You can add other update logic here if needed
    }
}


class SecondGameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SecondGameScene' });
    }

    preload() {
        this.load.image('basePlatform', 'assets/platform.png');
        this.load.image('p1', 'assets/platform.png');
        this.load.image('p2', 'assets/platform.png');
        this.load.image('p3', 'assets/platform.png');
        this.load.image('ball', 'assets/ball.png');
        this.load.image('pipe1', 'assets/pipe_new.png');
        this.load.image('boxingGlove', 'assets/boxing_final.png');

    }

    create() {
        this.platforms = this.physics.add.staticGroup();
        this.pipe = this.physics.add.staticImage(1400, 650, 'pipe1');
        this.pipe.setDepth(1);


        this.platforms.create(600, 700, 'basePlatform');
        this.platforms.create(-500, 220, 'p1');
        this.platforms.create(1300, 350, 'p2');
        this.platforms.create(-500, 500, 'p3');


        this.boxingGlove = this.physics.add.image(1650, 500, 'boxingGlove');
        this.boxingGlove.setCollideWorldBounds(true);
        this.boxingGlove.setDepth(0);
        this.boxingGlove.body.allowGravity = false;
        

        const textMessage = this.add.text(400, 300, 'Use Up, Down, Left, Right keys to move!', 
        {
            font: '32px Barlow Condensed',
            fill: '#ffffff',
            align: 'left'
        });
        textMessage.setPosition(600, 50);

        this.mainBall = this.physics.add.sprite(100, 0, 'ball');
        this.mainBall.setBounce(0.4);
        this.mainBall.setCollideWorldBounds(true);

        this.physics.add.collider(this.mainBall, this.platforms);
        this.physics.add.collider(this.mainBall, this.pipe, this.onBallHitPipe, null, this);
    }

    onBallHitPipe(mainBall, pipe) {
        // Set the initial position of the glove just off-screen
        this.boxingGlove.x = 1650; // Off-screen starting position
        this.boxingGlove.y = 500; // Fixed height for the glove
    
        // Push the ball away from the pipe
        // mainBall.setVelocityX(-500); // Push the ball in the opposite direction
    
        // Create a tween to move the glove to the left with an elastic effect

        
        this.tweens.add({
            targets: this.boxingGlove,
            x: 1400, // Target position for the glove
            duration: 10, // Quick move to simulate a punch
            ease: 'Elastic.Out', // Use Elastic easing for a spring effect
            onComplete: () => {
                // Pause briefly at the target position
                    mainBall.setVelocityX(-7000);
                    mainBall.setBounce(0.5,0.5);
                      

                    // Retract the glove back to its original position
                    this.tweens.add({
                        targets: this.boxingGlove,
                        x: 1650, // Move glove back off-screen
                        duration: 200, // Quick retract
                        ease: 'Elastic.In' // Use Elastic easing for the return
                    });
                
            }
        });
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


const config = 
{
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
    scene:[GameScene , WinScene , SecondGameScene]
};

const game = new Phaser.Game(config);
