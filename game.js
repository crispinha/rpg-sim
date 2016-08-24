/**
 * Created by crispin on 3/06/16.
 */

function find(key, array) {
	// The variable results needs var in this case (without 'var' a global variable is created)
	var results = [];
	for (var i = 0; i < array.length; i++) {
		if (array[i].indexOf(key) == 0) {
			results.push(array[i]);
		}
	}
	return results;
}

//thanks mozilla
function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


var game = new Phaser.Game(800, 800, Phaser.AUTO, 'div');
var goodGuys = [];
var scale = 7;
//takes grid [x, y] returns game [x, y]

var getGridCoords = function(x, y){
	if (x > map.width || y > map.height || x <= 0 || y <= 0) {
		throw RangeError("x or y is too big or too small: x: " + x + ', y: ' + y);
	}
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

		game.load.image('p_archer', 'assets/people/archer.png');
		game.load.image('p_chainmail-knight', 'assets/people/chainmail-knight.png');
		game.load.image('p_horse-knight', 'assets/people/horse-knight.png');
		game.load.image('p_knight', 'assets/people/knight.png');
		game.load.image('p_lady-peasant', 'assets/people/lady-peasant.png');
		game.load.image('p_peasant', 'assets/people/peasant.png');
			},
	create: function () {
		game.stage.backgroundColor = "#4488AA";
		game.state.start('play');
	}
};

var playState = {
	create: function () {
		//map setup
		map = game.add.tilemap('arena');
		map.addTilesetImage('Toen', 'tileset');
		bg = map.createLayer('Background');
		fg = map.createLayer('Foreground');

		//initial tilemap setup
		bg.scale = {x:scale, y:scale};
		fg.scale = {x:scale, y:scale};

		bg.fixedToCamera = false;
		bg.x = this.world.centerX - (map.widthInPixels * scale / 2);
		bg.y = this.world.centerY - (map.heightInPixels * scale / 2);

		fg.fixedToCamera = false;
		fg.x = this.world.centerX - (map.widthInPixels * scale / 2);
		fg.y = this.world.centerY - (map.heightInPixels * scale / 2);

		//sprite setup
		sprites = find('p_', game.cache.getKeys(Phaser.Cache.IMAGE));
		people = [];

		person = game.add.sprite(0, 0, 'p_peasant');
		person.gridX = 1;
		person.gridY = 1;
		person.inputEnabled = true;
		person.scale = {x: scale, y: scale};
		[person.x,person.y] = getGridCoords(person.gridX, person.gridY);

		//making people
		for (var i = 0; i < 2; i++) {
			console.log(i);
			people[i] = game.add.sprite(0, 0, sprites[Math.floor(Math.random() * sprites.length)]);
			people[i].scale = {x: scale, y: scale};
			people[i].gridX = getRandomIntInclusive(1, map.width);
			people[i].gridY = getRandomIntInclusive(1, map.height);
			console.log('X: ' + String(people[i].gridX), ', Y: ' + String(people[i].gridY));
			[people[i].x, people[i].y] = getGridCoords(people[i].gridX, people[i].gridY);
		}

		//control and debug setup
		fps = game.add.text(game.world.centerX + (game.world.width / 2.3), game.world.centerY - (game.world.height / 2.3), 00 + " FPS", {
			font: "12px Arial"
		});

		cursors = game.input.keyboard.createCursorKeys();
		space = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

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
	}

};

game.state.add('load', loadState);
game.state.add('play', playState);

game.state.start('load');