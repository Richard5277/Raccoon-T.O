// game variables
var map;
var tileset;
var layer;
var player;
var rats;
var facing = 'right';
var jumpTimer = 0;
var points = 0;
var cursors;
var jumpButton;
var bg;
var coins;
var waters;
var firewalls;
var bgmusic;
var jumpSound;
var coinSound;
var hurtSound;
var musicButton;

var upBtn;
var leftBtn;
var rightBtn;

var gameState = {
    preload: function() {
        game.load.tilemap('level1', '../assets/grass.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('grass', '../assets/grass.png');
        game.load.image('animation', '../assets/animation.jpeg');
        game.load.spritesheet('raccoon', '../assets/raccoon.png', 250, 219, 9);
        game.load.spritesheet('droid', '../assets/droid.png', 32, 32);
        game.load.spritesheet('rat', '../assets/rat.png', 159, 58);
        game.load.spritesheet('coin', '../assets/coin.png', 32, 32);
        game.load.spritesheet('water', '../assets/water.png', 32, 32);
        game.load.spritesheet('firewall', '../assets/firewall.png', 32, 32);
        game.load.image('starSmall', '../assets/star.png');
        game.load.image('starBig', '../assets/star2.png');
        game.load.image('background', '../assets/bg.jpg');

        game.load.image('up', '../assets/up.png', 64, 64);
        game.load.image('left', '../assets/left.png', 64, 64);
        game.load.image('right', '../assets/right.png', 64, 64);

        game.load.audio('bgmlvl1', 'assets/sound/05 Come and Find Me.mp3');
        game.load.audio('coinSound', '../assets/sound/341231__jeremysykes__coin00.mp3');
        game.load.audio('jump', '../assets/sound/341246__jeremysykes__jump02.mp3');
        game.load.audio('hurt', '../assets/sound/341681__jeremysykes__hurt04.mp3');
        
    },

    create: function() {

        //scaling options
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.time.events.add(Phaser.Timer.SECOND * 180, this.endTimer,this);
        //have the game centered horizontally
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.stage.backgroundColor = '#000000';

        bg = game.add.image(0, 0, 'background');
        // bg.fixedToCamera = true;

        map = game.add.tilemap('level1');

        map.addTilesetImage('grass');
        map.addTilesetImage('animation');
        map.addTilesetImage('coin');
        map.addTilesetImage('water');
        map.addTilesetImage('firewall');
        map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);

        layer = map.createLayer('Tile Layer 1');
        //  Un-comment this on to see the collision tiles
        // layer.debug = true;
        // coinLayer.debug = true;

        layer.resizeWorld();

        //Music and Sounds
        bgmusic = game.add.audio('bgmlvl1', 1.5);
        bgmusic.play();
        jumpSound = game.add.audio('jump', .5);
        coinSound = game.add.audio('coinSound', .5);
        hurtSound = game.add.audio('hurt', .5);

        game.physics.arcade.gravity.y = 250;

        // player
        player = game.add.sprite(20, 20, 'raccoon', 7);
        player.scale.setTo(.25);
        player.anchor.setTo(.5, 1);
        game.physics.enable(player, Phaser.Physics.ARCADE);


        player.body.bounce.y = 0.2;
        player.body.collideWorldBounds = true;
        player.animations.add('walk');

        game.camera.follow(player);

        // Points
        var style = { font: "18px Arial", fill: "#fff"};
        pointsText = game.add.text(10, 20, "Points: " + points, style);
        pointsText.fixedToCamera = true;

        // Rats
        rats = game.add.group();
        this.generateRats();

        cursors = game.input.keyboard.createCursorKeys();
        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        coins = game.add.group();
        coins.enableBody = true;

        //  And now we convert all of the Tiled objects with an ID of 34 into sprites within the coins group
        map.createFromObjects('Object Layer 1', 34, 'coin', 0, true, false, coins);
        console.log(coins);

        //  Add animations to all of the coin sprites
        coins.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3, 4, 5], 10, true);
        coins.callAll('animations.play', 'animations', 'spin');

        //Water Sprites
        waters = game.add.group();
        waters.enableBody = true;

        //  And now we convert all of the Tiled objects with an ID of 34 into sprites within the coins group
        map.createFromObjects('water', 35, 'water', 0, true, false, waters);
        console.log(waters);
        //  Add animations to all of the coin sprites
        waters.callAll('animations.add', 'animations', 'right', [0, 1, 2, 3, 4, 5], 5, true);
        waters.callAll('animations.play', 'animations', 'right');

        //Water Sprites
        firewalls = game.add.group();
        firewalls.enableBody = true;

        //  And now we convert all of the Tiled objects with an ID of 34 into sprites within the coins group
        map.createFromObjects('firewall', 36, 'firewall', 0, true, false, firewalls);
        console.log(firewalls);
        //  Add animations to all of the coin sprites
        firewalls.callAll('animations.add', 'animations', 'right', [0, 1], 10, true);
        firewalls.callAll('animations.play', 'animations', 'right');

        musicButton = game.add.button(game.width - 80, 20,'droid',this.musicOnOff,this,0,1,2);
        musicButton.fixedToCamera = true;

    },

    musicOnOff: function() {
        if (bgmusic.volume != 0) {
            bgmusic.volume = 0;
        } else {
            bgmusic.volume = 1.5;
        }
    },

    update: function() {

        for (var i = 0; i < coins.children.length; i++) {
            coins.children[i].body.immovable = true;
            coins.children[i].body.velocity.y = 0;
            coins.children[i].body.allowGravity = false;
        }

        for (var i = 0; i < waters.children.length; i++) {
            waters.children[i].body.immovable = true;
            waters.children[i].body.velocity.y = 0;
            waters.children[i].body.allowGravity = false;
            waters.children[i].enableBody = true;
        }

        for (var i = 0; i < firewalls.children.length; i++) {
            firewalls.children[i].body.immovable = true;
            firewalls.children[i].body.velocity.y = 0;
            firewalls.children[i].body.allowGravity = false;
            firewalls.children[i].enableBody = true;
        }

        game.physics.arcade.collide([player,rats], layer);
        game.physics.arcade.collide(player,rats, this.collisionHandler);
        game.physics.arcade.overlap(player, waters, this.playerDrown, null, this);
        game.physics.arcade.overlap(player, coins, this.collectCoin, null, this);
        game.physics.arcade.overlap(player, firewalls, this.hitFireWall, null, this);
        player.body.velocity.x = 0;

    //Player controls and animations
    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -200;

        player.animations.play('walk',9,true);
        //player facing left
        player.scale.x = -.3;
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 200;

        player.animations.play('walk',9,true);
        //player facing right
        player.scale.x = .3;
    } else {
        player.animations.stop('walk');
        player.frame = 7;
    }

    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
    {
        player.body.velocity.y = -250;
        jumpTimer = game.time.now + 750;
        jumpSound.play();
    } 

    // if (jumpButton.isDown && player.body.onFloor() && player.scale.x < 0 && player.body.velocity.x < 0){
    //     player.body.angularVelocity = 25;
    // } else if (jumpButton.isDown && player.body.onFloor() && player.scale.x > 0 && player.body.velocity.x > 0){
    //     player.body.angularVelocity = -25;
    // } else if (player.body.onFloor() && player.body.velocity.x == 0) {
    //     player.body.angularVelocity = 0;
    //     player.body.rotation = 0;
    // }

    //check rat direction
    for (var i = 0; i < rats.children.length; i++) {
        if (rats.children[i].body.velocity.x < 0) {
            rats.children[i].scale.x = .45;
        } else if (rats.children[i].body.velocity.x > 0) {
            rats.children[i].scale.x = -.45;
        }
    }

    upButton = game.add.button(game.width - 150, game.height - 100, 'up', this.playerJump, this, 2, 1, 0);
    leftButton = game.add.button(game.world.left + 50, game.height - 100, 'left', this.playerGoLeft, this, 2, 1, 0);
    rightButton = game.add.button(game.world.left + 150, game.height - 100, 'right', this.playerGoRight, this, 2, 1, 0);

    this.checkWin();

},

playerJump: function(){
    player.body.velocity.y = -250;
    jumpTimer = game.time.now + 750;
    jumpSound.play();
},
playerGoLeft: function(){
    //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('walk',9,true);
        //player facing left
        player.scale.x = -.3;
},
playerGoRight: function(){
    //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('walk',9,true);
        //player facing right
        player.scale.x = .3;
},

// createGamepad: function(game) {
//   var vPadding = 10;
//   var hPadding = 20;
//   var scale = 2;

//   var leftBtn = new Phaser.Button(game, hPadding, game.height - vPadding,
//     'buttons');
//   leftBtn.frame = 0;

//   var rightBtn = new Phaser.Button(game, hPadding * 3 + leftBtn.width * scale,
//     game.height - vPadding, 'buttons');
//   rightBtn.frame = 1;

//   var upBtn = new Phaser.Button(game, game.width - hPadding,
//     game.height - vPadding, 'buttons');
//   upBtn.frame = 2;

//   [leftBtn, rightBtn, upBtn].forEach(function (btn) {
//     // register callbacks
//     btn.isDown = false;
//     btn.events.onInputDown.add(function () { btn.isDown = true; });
//     btn.events.onInputUp.add(function () { btn.isDown = false; });
//     // appearance
//     btn.alpha = 0.25;
//     btn.anchor.setTo(0, 1);
//     btn.scale.setTo(scale);
// });

//   upBtn.anchor.setTo(1, 1);

//   return { left: leftBtn, right: rightBtn, up: upBtn };
// },

collectCoin: function(player, coin) {

    coin.kill();
    console.log("collect!");
    coinSound.play();
    points += 10;
    pointsText.text = "Points: " + points;
},

generateRats: function() {

        //enable physics in them
        rats.enableBody = true;
        rats.physicsBodyType = Phaser.Physics.ARCADE;

        //phaser's random number generator
        var numRats = game.rnd.integerInRange(10, 20);
        var rat;

        for (var i = 0; i < numRats; i++) {
            //add sprite within an area excluding the beginning and ending
            //  of the game world so items won't suddenly appear or disappear when wrapping
            var x = game.rnd.integerInRange(game.width, game.world.width - game.width);
            var y = game.rnd.integerInRange(game.height, game.world.height - game.height);
            rat = rats.create(x, y, 'rat');
            var walk = rat.animations.add('walk');

            rat.body.collideWorldBounds = true;
            rat.body.bounce.setTo(1,0);
            rat.anchor.setTo(.5, 1);
            rat.scale.setTo(.45,.45);
            rat.animations.play('walk', 7, true);
            rat.body.velocity.x = game.rnd.integerInRange(-300,300);

            rat.body.gravity.y = 750;
        }
    },

    collisionHandler: function(player, rat) {
        console.log("gameover");

        this.gameOver();
    },

    playerDrown: function() {
        console.log("stepped in water!!!");
        this.gameOver();
    },

    checkWin: function() {
        //Check if Player reaches end of stage
        if (player.position.x + player.width >= game.world.bounds.right && player.position.y >= game.world.bounds.bottom) {
            console.log("End of Stage!");
        }
    },
    hitFireWall: function(){
        console.log("Fire Wall!!!");
        this.gameOver();
    },

    endTimer: function(){
        this.gameOver();
    },

    gameOver: function() {
        bgmusic.stop();
        hurtSound.play();
        points = 0;
        pointsText.text = "Points: " + points;
        game.state.start('Menu');
    },

    render: function () {
        game.debug.text("Game Timer: " + game.time.events.duration, 500, 20);
    }
}
