var imgPacman = document.getElementById("pacman");
var imgCoin = document.getElementById("coin");
var c = document.getElementById('canvas');
var ctx = c.getContext('2d');

currentRow = 0;
currentCol = 0;
coins = [];
points = 0;

function pushState() {
	for (var row = 0; row < 10; row++) {
		var arr = [];
		for (var col = 0; col < 10; col++) {
			arr.push(Math.random() < 0.2);
		}
		coins.push(arr);
	}
	coins[0][0] = false;
}

function draw() {
	ctx.clearRect(0, 0, c.width, c.height);

	for (var row = 0; row < 10; row++) {
		for (var col = 0; col < 10; col++) {
			ctx.fillStyle = 'black';
			ctx.fillRect(row * 55, col * 55, 50, 50);

			if (coins[row][col]) {
				var x = (row * 55) + 15;
				var y = (col * 55) + 15;
				ctx.drawImage(imgCoin, x, y, 20, 20);
			}
		}
	}

	ctx.drawImage(imgPacman, currentCol * 55, currentRow * 55, 40, 40);
}

function moveDown() {
	if (currentRow < 9) {
		currentRow++;
		if (coins[currentCol][currentRow]) {
			coins[currentCol][currentRow] = false;
			points++;
		}
		draw();
	}
}

function moveUp() {
	if (currentRow > 0) {
		currentRow--;
		if (coins[currentCol][currentRow]) {
			coins[currentCol][currentRow] = false;
			points++;
		}
		draw();
	}
}

function moveLeft() {
	if (currentCol > 0) {
		if (coins[currentCol - 1][currentRow]) {
			coins[currentCol - 1][currentRow] = false;
			points++;
		}
		;
		currentCol--;
		draw();
	}
}

function moveRight() {
	if (currentCol < 9) {
		if (coins[currentCol + 1][currentRow]) {
			coins[currentCol + 1][currentRow] = false;
			points++;
		}
		currentCol++;
		draw();
	}
}

function pritisna(event) {
	switch (event.keyCode) {
	case 40:
		moveDown();
		break;
	case 37:
		moveLeft();
		break;
	case 39:
		moveRight();
		break;
	case 38:
		moveUp();
		break;
	}
}

pushState();
draw();
document.onkeypress = pritisna;
$('#pacman').hide();
$('#coin').hide();
