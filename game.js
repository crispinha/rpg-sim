/**
 * Created by crispin on 3/06/16.
 */
var game = new Phaser.Game(800, 800, Phaser.AUTO, 'div');
var goodGuys = [];
var scale = 7;
//takes grid [x, y] returns game [x, y]
var getGridCoords = function(x, y){
	// if (x > map.width || y > map.height || x <= 0 || y <= 0) {
	// 	throw RangeError("x or y is too big or too small: x: " + x + ', y: ' + y);
	// }
	return [bg.x + (map.tileWidth * scale * (x - 1)), bg.y + (map.tileHeight * scale * (y - 1))];
};

var isLocationInRange = function(x, y){
	if (x > 0 && x <= map.height && y > 0 && y <= map.height) {
		return true;
	} else {
		return false;
	}
};

var loadState = {
	preload: function () {
		game.time.advancedTiming = true;
		game.stage.smoothed = false;
		game.antialias = false;
		game.load.tilemap('arena', 'assets/battlemap.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.image('tileset', 'assets/tileset.png');

		game.load.image('archer', 'assets/people/archer.png');
		game.load.image('chainmail-knight', 'assets/people/chainmail-knight.png');
		game.load.image('horse-knight', 'assets/people/horse-knight.png');
		game.load.image('knight', 'assets/people/knight.png');
		game.load.image('lady-peasant', 'assets/people/lady-peasant.png');
		game.load.image('peasant', 'assets/people/peasant.png');
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
		space = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

		person = game.add.sprite(0, 0, 'archer');
		person.gridX = 1;
		person.gridY = 1;
		person.inputEnabled = true;
		person.scale = {x: scale, y: scale};

		bg.scale = {x:scale, y:scale};
		fg.scale = {x:scale, y:scale};

		bg.fixedToCamera = false;

		bg.x = this.world.centerX - (map.widthInPixels * scale / 2);
		bg.y = this.world.centerY - (map.heightInPixels * scale / 2);

		fg.fixedToCamera = false;

		fg.x = this.world.centerX - (map.widthInPixels * scale / 2);
		fg.y = this.world.centerY - (map.heightInPixels * scale / 2);
		[person.x,person.y] = getGridCoords(person.gridX, person.gridY);

	},
	update: function () {
		fps.setText(game.time.fps + " FPS");
		if (cursors.up.isDown){
			if (isLocationInRange(person.gridX, person.gridY - 1)) {
				person.gridY--; }
			cursors.up.reset();
		}
		if (cursors.down.isDown){
			if (isLocationInRange(person.gridX, person.gridY + 1)) {
				person.gridY++; }
			cursors.down.reset();
		}
		if (cursors.left.isDown){
			if (isLocationInRange(person.gridX - 1, person.gridY)) {
				person.gridX--; }
			cursors.left.reset();
		}
		if (cursors.right.isDown) {
			if (isLocationInRange(person.gridX + 1, person.gridY)) {
				person.gridX++; }
			cursors.right.reset();
		}

		[person.x,person.y] = getGridCoords(person.gridX, person.gridY);
		if (space.isDown) {
			console.log(isLocationInRange(person.gridX, person.gridY));
			space.reset();
		}


}

};

game.state.add('load', loadState);
game.state.add('play', playState);

game.state.start('load');