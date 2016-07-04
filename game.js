/**
 * Created by crispin on 3/06/16.
 */
var game = new Phaser.Game(800, 800, Phaser.AUTO, 'div');
var goodGuys = [];
var scale = 7;
//takes grid [x, y] returns game [x, y]
var getGridCoords  = function(x, y){
	if (x > map.width || y > map.width || x < 0 || y < 0) {
		throw RangeError("x or y is too big or too small" + x + ' ' + y);
	}
	return [bg.x + (map.tileWidth * scale * (x - 1)), bg.y + (map.tileHeight * scale * (y - 1))];
};
var loadState = {
	preload: function () {
		game.time.advancedTiming = true
		game.stage.smoothed = false;
		game.antialias = false;
		game.load.tilemap('arena', 'assets/battlemap.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.image('tileset', 'assets/tileset.png');
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
		map.addTilesetImage('Toen', 'tileset');
		bg = map.createLayer('Background');
		fg = map.createLayer('Foreground');

		fps = game.add.text(game.world.centerX + (game.world.width / 2.3), game.world.centerY - (game.world.height / 2.3), 00 + " FPS", {
			font: "12px Arial"
		});

		cursors = game.input.keyboard.createCursorKeys();

		person = game.add.sprite(0, 0, 'archer');
		person.gridX = 1;
		person.gridY = 1;
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
		[person.x,person.y] = getGridCoords(person.gridX, person.gridY);

	},
	update: function () {
		// fps.setText(game.time.fps + " FPS");
		if (cursors.up.isDown){
			person.gridY--;
			[person.x,person.y] = getGridCoords(person.gridX, person.gridY);
			cursors.up.reset();
		}
		if (cursors.down.isDown){
			person.gridY++;
			[person.x,person.y] = getGridCoords(person.gridX, person.gridY);
			cursors.down.reset();
		}
		if (cursors.left.isDown){
			person.gridX--;
			[person.x,person.y] = getGridCoords(person.gridX, person.gridY);
			cursors.left.reset();
		}
		if (cursors.right.isDown){
			person.gridX++;
			[person.x,person.y] = getGridCoords(person.gridX, person.gridY);
			cursors.right.reset();
		}
	}
};

game.state.add('load', loadState);
game.state.add('play', playState);

game.state.start('load');