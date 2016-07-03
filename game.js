/**
 * Created by crispin on 3/06/16.
 */
var game = new Phaser.Game(800, 800, Phaser.AUTO, 'div');
var goodGuys = [];
var scale = 7;
//takes grid [x, y] returns game [x, y]
var getGridCoords  = function(x, y){
	if (x > map.width || y > map.width) {
		throw RangeError("x or y is too big");
	}
	return [bg.x + (map.tileWidth * scale * (x - 1)), bg.y + (map.tileHeight * scale * (y - 1))];
};
var loadState = {
	preload: function () {
		game.stage.smoothed = false;
		game.antialias = false;
		game.load.tilemap('arena', 'assets/holodeck.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.image('tileset', 'assets/holodeck.png');
		game.load.image('archer', 'assets/archer.png');
			},
	create: function () {
		game.stage.backgroundColor = "#4488AA";
		game.state.start('play');
	}
};

var playState = {
	create: function () {
		map = game.add.tilemap('arena');
		map.addTilesetImage('holodeck', 'tileset');
		bg = map.createLayer('Background');
		// fg = map.createLayer('Foreground');
		person = game.add.sprite(0, 0, 'archer');
		person.inputEnabled = true;

		bg.scale = {x:scale, y:scale};
		// fg.scale = {x:scale, y:scale};

		person.scale = {x: scale, y: scale};

		bg.fixedToCamera = false;

		bg.x = this.world.centerX - (map.widthInPixels * scale / 2);
		bg.y = this.world.centerY - (map.heightInPixels * scale / 2);

		// fg.fixedToCamera = false;
		//
		// fg.x = this.world.centerX - (map.widthInPixels * scale / 2);
		// fg.y = this.world.centerY - (map.heightInPixels * scale / 2);
		[person.x,person.y] = getGridCoords(1, 1);
		person.events.onInputDown.add(function () {[person.x,person.y] = getGridCoords(6, 6);}, this);
	},
	update: function () {
		// person.x = game.input.mousePointer.x - person.width / 2;
		// person.y = game.input.mousePointer.y - person.height / 2;

	}
};

game.state.add('load', loadState);
game.state.add('play', playState);

game.state.start('load');