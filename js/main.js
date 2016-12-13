var game = new Phaser.Game(1080, 720, Phaser.AUTO, '');
game.state.add('Menu', menuState);
game.state.add('Game', gameState);

game.state.start('Menu');






