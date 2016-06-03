/**
 * Created by crispin on 3/06/16.
 */
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'div');

var loadState = {
	preload: function () {
			},
	create: function () {
		game.state.start('play');
	}
};

var playState = {
	create: function () {

	},
	update: function () {


	}
};

game.state.add('load', loadState);
game.state.add('play', playState);

game.state.start('load');