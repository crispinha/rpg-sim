/**
 * Created by crispin on 3/06/16.
 */
var game = new Phaser.Game(800, 800, Phaser.AUTO, 'div');
var goodGuys = [];
var scale = 7;
//takes grid [x, y] returns game [x, y]
var getGridCoords  = function(x, y){
	console.log(map.widthInPixels * scale)
};

var loadState = {
	preload: function () {
		game.stage.smoothed = false;
		game.antialias = false;
		game.load.tilemap('arena', 'assets/battlemap.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.image('tileset', 'assets/tileset.png');
		game.load.image('archer', 'assets/archer.png');
			},
	create: function () {
		game.state.start('play');
	}
};

var playState = {
	create: function () {
		map = game.add.tilemap('arena');
		map.addTilesetImage('Toen', 'tileset');
		bg = map.createLayer('Background');
		fg = map.createLayer('Foreground');
		person = game.add.sprite(0, 0, 'archer');
		person.inputEnabled = true;

		bg.scale = {x:scale, y:scale};
		fg.scale = {x:scale, y:scale};

		person.scale = {x: scale, y: scale};

		bg.fixedToCamera = false;

		bg.x = this.world.centerX - (map.widthInPixels * scale / 2);
		bg.y = this.world.centerY - (map.heightInPixels * scale / 2);

		fg.fixedToCamera = false;

		fg.x = this.world.centerX - (map.widthInPixels * scale / 2);
		fg.y = this.world.centerY - (map.heightInPixels * scale / 2);

		person.events.onInputDown.add(function () {getGridCoords(1,1)}, this);

	},
	update: function () {
		person.x = game.input.mousePointer.x - person.width / 2;
		person.y = game.input.mousePointer.y - person.height / 2;

	}
};

game.state.add('load', loadState);
game.state.add('play', playState);

game.state.start('load');