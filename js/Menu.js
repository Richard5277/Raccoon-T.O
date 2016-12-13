var menuState = {
    preload: function() {
        //assets we'll use in the loading screen
        // load.image('preloadbar', 'assets/images/preloader-bar.png');
        game.load.image('bg', '../assets/bg.jpg');
    },
    create: function() {

        //scaling options
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        //h and v align
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        //the game will have a sky blue background
        game.add.image(0,0,'bg');

        var style = { font: "48px Helvetica", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

        //  Title
        var bar = game.add.graphics();
        bar.beginFill(0x000000, 0.2);
        bar.drawRect(0, 100, game.width, 175);
        var text = game.add.text(0, 0, "Raccoon Tales", style);
        text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

        //  We'll set the bounds to be from x0, y100 and be 800px wide by 100px high
        text.setTextBounds(0, 100, game.width, 100);

        var style2 = { font: "24px Helvetica", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
        var text2 = game.add.text(0,0, "Press Spacebar to Start", style2);
        text2.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

        text2.setTextBounds(0, 175, game.width, 100);

        startButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    },
    update: function() {
        if(game.input.activePointer.justPressed()) {
            game.state.start('Game');
        }

        if (startButton.isDown) {
            game.state.start('Game');
        }
    }
}