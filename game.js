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
	var min = Math.ceil(min);
	var max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

var scale = 1;
var game = new Phaser.Game(scale * 100, scale * 100, Phaser.AUTO, 'div');

//takes grid [x, y] returns game [x, y]
var getRealCoords = function(x, y){
	if (x > vars.map.width || y > vars.map.height || x <= 0 || y <= 0) {
		throw RangeError("x or y is too big or too small: x: " + x + ', y: ' + y);
	}
	return [vars.bg.x + (vars.map.tileWidth * scale * (x - 1)), vars.bg.y + (vars.map.tileHeight * scale * (y - 1))];
};

//takes game [x,y] returns grid [x,y]
var getGridCoords = function (x, y) {
	return [vars.bg.getTileX(x) / scale, vars.bg.getTileY(y) / scale];
};

var isLocationInRange = function (x, y){
	if (x > 0 && x <= vars.map.height && y > 0 && y <= vars.map.height) {
		return true;
	} else {
		return false;
	}
};

var isLocationAccessable = function (x, y) {
	if (vars.map.getTile(x - 1, y - 1, "Foreground") == null && isLocationInRange(x, y)) {
		return true;
	} else {
		return false;
	}
};

var isLocationOccupied = function (x, y) {
	for (var i = 0; i < vars.sprites.children.length; i++) {
		if (x == vars.sprites.children[i].gridX && y == vars.sprites.children[i].gridY) {
			return true
		}
	}
	return false;
};

var isEnemyAtLocation = function (x, y) {
	for (var i = 0; i < vars.evil_people.length; i++) {
		if (x == vars.evil_people[i].gridX && y == vars.evil_people[i].gridY) {
			return true
		}
	}
	return false;
};

var getDistanceInTiles = function (a, b) {
	var sum = [a[0] - b[0], a[1] - b[1]];
	var abs_sum = [Math.abs(sum[0]), Math.abs(sum[1])];
	return abs_sum;
};

var areTilesInRange = function (a, b, range) {
	var initial = getDistanceInTiles(a, b);
	if ((initial[0] == 0 && initial[1] < range) || (initial[1] == 0 && initial[0] < range)) {
		return true;
	} else {
		return false;
	}
};

var doAttack = function (attacker, defender) {
	defender.stats.health = defender.stats.health - attacker.stats.attack();

	attacker.stats.health = attacker.stats.health - Math.floor(defender.stats.attack() / 2);

	if (defender.stats.health <= 0){
		defender.kill();
	}

	if (attacker.stats.health <= 0){
		attacker.kill();
	}

	console.log('defender: ' + defender.stats.health + '\nattacker: ' + attacker.stats.health)
};

var vars = new Object();

var loadState = {
	preload: function () {
		game.time.advancedTiming = true;
		game.stage.smoothed = false;
		game.antialias = false;
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		Phaser.Canvas.setImageRenderingCrisp(game.canvas);
		PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;
		game.load.tilemap('arena', 'assets/battleground.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.image('tileset', 'assets/spritesheet.png');

		game.load.image('p_archer', 'assets/friendly-people/archer.png');
		game.load.image('p_chainmail-knight', 'assets/friendly-people/chainmail-knight.png');
		game.load.image('p_horse-knight', 'assets/friendly-people/horse-knight.png');
		game.load.image('p_knight', 'assets/friendly-people/knight.png');
		game.load.image('p_lady-peasant', 'assets/friendly-people/lady-peasant.png');
		game.load.image('p_peasant', 'assets/friendly-people/peasant.png');

		game.load.image('e_archer', 'assets/evil-people/archer.png');
		game.load.image('e_chainmail-knight', 'assets/evil-people/chainmail-knight.png');

		game.load.image('target', 'assets/target.png');
		game.load.image('trans-grey', 'assets/trans-grey.png');
		game.load.image('trans-blue', 'assets/trans-blue.png');
		game.load.image('trans-red', 'assets/trans-red.png');
			},

	create: function () {
		game.stage.backgroundColor = "#4488AA";
		game.state.start('play');
	}
};

var playState = {
	create: function () {
		//map setup
		vars.map = game.add.tilemap('arena');
		vars.map.addTilesetImage('spritesheet', 'tileset');
		vars.map.x = this.world.centerX - (vars.map.widthInPixels * scale / 2);
		vars.map.y = this.world.centerY - (vars.map.heightInPixels * scale / 2);
		vars.bg = vars.map.createLayer('Background');
		vars.fg = vars.map.createLayer('Foreground');

		//initial tilemap setup
		vars.bg.scale = {x:scale, y:scale};
		vars.fg.scale = {x:scale, y:scale};

		vars.bg.fixedToCamera = false;
		vars.bg.x = this.world.centerX - (vars.map.widthInPixels * scale / 2);
		vars.bg.y = this.world.centerY - (vars.map.heightInPixels * scale / 2);

		vars.fg.fixedToCamera = false;
		vars.fg.x = this.world.centerX - (vars.map.widthInPixels * scale / 2);
		vars.fg.y = this.world.centerY - (vars.map.heightInPixels * scale / 2);

		//sprite setup
		vars.sprites = game.add.group();
		vars.ui_elements = game.add.group();
		vars.friendly_sprites = find('p_', game.cache.getKeys(Phaser.Cache.IMAGE));
		vars.friendly_people = [];
		vars.evil_sprites = find('e_', game.cache.getKeys(Phaser.Cache.IMAGE));
		vars.evil_people = [];

		vars.target = game.add.sprite(0, 0, 'target');
		vars.sprites.add(vars.target);
		vars.ui_elements.add(vars.target);
		vars.target.gridX = 1;
		vars.target.gridY = 1;
		vars.target.scale = {x: scale, y: scale};
		[vars.target.x, vars.target.y] = getRealCoords(vars.target.gridX, vars.target.gridY);
		vars.target.on = false;

		//making vars.friendly_people
		for (var i = 0; i < 2; i++) {
			vars.friendly_people[i] = game.add.sprite(0, 0, vars.friendly_sprites[Math.floor(Math.random() * vars.friendly_sprites.length)]);
			vars.friendly_people[i].scale = {x: scale, y: scale};
			do {
				vars.friendly_people[i].gridX = getRandomIntInclusive(1, vars.map.width);
				vars.friendly_people[i].gridY = getRandomIntInclusive(1, vars.map.height);
			} while (!isLocationAccessable(vars.friendly_people[i].gridX, vars.friendly_people[i].gridY) && !isLocationOccupied(vars.friendly_people[i].gridX, vars.friendly_people[i].gridY));
			vars.sprites.add(vars.friendly_people[i]);
			[vars.friendly_people[i].x, vars.friendly_people[i].y] = getRealCoords(vars.friendly_people[i].gridX, vars.friendly_people[i].gridY);
			vars.friendly_people[i].inputEnabled = true;
			vars.friendly_people[i].stats = {attack: (function(){var x = getRandomIntInclusive(1, 3);return x;}), health: 5, range: 3, speed: 4};
		}

		//making vars.evil_people
		for (var i = 0; i < 2; i++) {
			vars.evil_people[i] = game.add.sprite(0, 0, vars.evil_sprites[Math.floor(Math.random() * vars.evil_sprites.length)]);
			vars.evil_people[i].scale = {x: scale, y: scale};
			do {
				vars.evil_people[i].gridX = getRandomIntInclusive(1, vars.map.width);
				vars.evil_people[i].gridY = getRandomIntInclusive(1, vars.map.height);
			} while (!isLocationAccessable(vars.evil_people[i].gridX, vars.evil_people[i].gridY) && !isLocationOccupied(vars.evil_people[i].gridX, vars.evil_people[i].gridY));
			vars.sprites.add(vars.evil_people[i]);
			[vars.evil_people[i].x, vars.evil_people[i].y] = getRealCoords(vars.evil_people[i].gridX, vars.evil_people[i].gridY);
			vars.evil_people[i].inputEnabled = true;
			vars.evil_people[i].stats = {attack: (function(){var x = getRandomIntInclusive(1, 3);return x;}), health: 5, range: 3, speed: 4}
		}

		//control and debug setup
		vars.fps = game.add.text(game.world.centerX + (game.world.width / 2.3), game.world.centerY - (game.world.height / 2.3), 00 + " FPS", {
			font: "1px Arial", fill: "#FFFFFF"
		});

		game.world.bringToTop(vars.ui_elements);

		vars.cursors = game.input.keyboard.createCursorKeys();
		vars.space = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

		//movement stuff
		for (var i = 0; i < vars.friendly_people.length; i++) {
			vars.friendly_people[i].events.onInputDown.add(function () {
				//index stuff is a horrible hack (probably) but it works
				vars.target.on = true;
				vars.target.user = vars.friendly_people[this.index];
				game.input.onDown.addOnce(function () {
					[cursor_grid_x, cursor_grid_y] = getGridCoords(game.input.activePointer.x, game.input.activePointer.y);
					[pointer_grid_x, pointer_grid_y] = [cursor_grid_x + 1, cursor_grid_y + 1];
					//long line mofo
					if (isLocationInRange(pointer_grid_x, pointer_grid_y) && isLocationAccessable(pointer_grid_x, pointer_grid_y)
						&& !isLocationOccupied(pointer_grid_x, pointer_grid_y)) {
						[vars.friendly_people[this.index].gridX, vars.friendly_people[this.index].gridY] = [pointer_grid_x, pointer_grid_y];
						[vars.friendly_people[this.index].x, vars.friendly_people[this.index].y] = getRealCoords(vars.friendly_people[this.index].gridX, vars.friendly_people[this.index].gridY);
						vars.target.on = false;
						vars.target.user = null;
					}
				}, this);
			}, {index: i})
		}

		//attacking stuff
		for (var i = 0; i < vars.evil_people.length; i++) {
			vars.evil_people[i].events.onInputDown.add(function () {
				if (vars.target.on) {
					//do attack
					doAttack(vars.target.user, vars.evil_people[this.index]);
				}
				vars.target.on = false;
				vars.target.user = null;
			}, {index: i})
		}

	},
	update: function () {
		vars.fps.setText(game.time.fps + " FPS");

		var cursor_grid_x, cursor_grid_y;
		var pointer_grid_x, pointer_grid_y;

		[cursor_grid_x, cursor_grid_y] = getGridCoords(game.input.activePointer.x, game.input.activePointer.y);
		[pointer_grid_x, pointer_grid_y] = [cursor_grid_x + 1, cursor_grid_y + 1];
		if (isLocationInRange(pointer_grid_x, pointer_grid_y)) {
			[vars.target.gridX, vars.target.gridY] = [pointer_grid_x, pointer_grid_y];
			[vars.target.x, vars.target.y] = getRealCoords(vars.target.gridX, vars.target.gridY);
		}

		if (vars.space.isDown){
			areTilesInRange([1, 1], [pointer_grid_x, pointer_grid_y], 3);
		}

		if (vars.target.on && isEnemyAtLocation(pointer_grid_x, pointer_grid_y)) {
			vars.target.loadTexture('trans-red');
		} else if (vars.target.on && isLocationOccupied(pointer_grid_x, pointer_grid_y) || vars.target.on && !isLocationAccessable(pointer_grid_x, pointer_grid_y)) {
			vars.target.loadTexture('trans-grey')
		} else if (vars.target.on) {
			vars.target.loadTexture('trans-blue');
		} else {
			vars.target.loadTexture('target');
		}

	}

};

game.state.add('load', loadState);
game.state.add('play', playState);

game.state.start('load');