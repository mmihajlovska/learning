var imgPacman = document.getElementById("pacman");
var imgCoin = document.getElementById("coin");
var imgbad1 = document.getElementById("bad1");
var imgIceCream = document.getElementById("iceCream");
var imgPacmanLife = document.getElementById("pacmanLife");
var c = document.getElementById('canvas');
var ctx = c.getContext('2d');
var c2 = document.getElementById('canvas2');
var ctx2 = c2.getContext('2d');

function rotate(angle, x, y) {
	ctx.save();
	ctx.translate(25, 25);
	ctx.rotate(angle * Math.PI / 180);
	ctx.drawImage(imgPacman, x, y, 40, 40);
	ctx.restore();
}

function timer() {
	if (time > 0) {
		drawForTheEnd('TIME: ' + time);
		time--;
	} else {
		drawForTheEnd('GAME OVER');
		clearInterval(tr);
		clearInterval(b);
	}
}

function pravecRotate(a, b, c, d) {
	if (pravec == 'r') {
		rotate(0, a, b);
	} else if (pravec == 'u') {
		rotate(270, c, a);
	} else if (pravec == 'l') {
		rotate(180, d, c);
	} else {
		rotate(90, b, d);
	}
}

function howIsRotate() {
	var a = -20 + (currentCol * 50);
	var b = -20 + (currentRow * 50);
	var c = -20 - (currentRow * 50);
	var d = -20 - (currentCol * 50);
	pravecRotate(a, b, c, d)
}

function pushValueBlockade() {
	for (var row = 0; row < 11; row++) {
		var arr = [];
		for (var col = 0; col < 11; col++) {
			if (((row >= 3 && row <= 7) && col == 2)
					|| ((row >= 3 && row <= 7) && col == 8)
					|| (row == 5 && col == 3) || (row == 5 && col == 7)) {
				arr.push(true);
			} else {
				arr.push(false);
			}
		}
		blockade.push(arr);
	}
}

function pushValueCoins() {
	for (var row = 0; row < 11; row++) {
		var arr = [];
		for (var col = 0; col < 11; col++) {
			if (!blockade[row][col]) {
				arr.push(true);
			} else {
				arr.push(false);
			}
		}
		coins.push(arr);
	}
	coins[0][0] = false;
	coins[3][5] = false;
	coins[7][5] = false;
}

function coinsTrue(row, col) {
	if (coins[row][col]) {
		var x = (row * 50) + 15;
		var y = (col * 50) + 15;
		ctx.drawImage(imgCoin, x, y, 20, 20);
	}
}

function blockadeTrue(row, col) {
	if (blockade[row][col]) {
		if (row == 3) {
			drawHalfCircle(row, col, 0.5, 1.5);
			drawRectangle(row + 25, col, 25, 50);
		} else if (row == 4) {
			drawRectangle(row, col, -25, 50);
			drawRectangle(row, col, 50, 50);
		} else if (row == 7) {
			drawHalfCircle(row, col, 1.5, 0.5);
			drawRectangle(row, col, 25, 50);
		} else if (row == 5 && col == 3) {
			drawHalfCircle(row, col, 0, 1);
			drawRectangle(row, col, 50, 25);
		} else if (row == 5 && col == 7) {
			drawHalfCircle(row, col, 1, 0);
		} else if (col == 8 && row == 5) {
			drawRectangle(row, col, 50, -25);
			drawRectangle(row, col, 50, 50);
		} else {
			drawRectangle(row, col, 50, 50);
		}
	}
}

function drawHalfCircle(row, col, x, y) {
	ctx.beginPath();
	ctx.fillStyle = 'blue';
	ctx.arc(row * 50 + 25, col * 50 + 25, 25, x * Math.PI, y * Math.PI);
	ctx.fill();
}

function drawRectangle(row, col, width, height) {
	ctx.fillStyle = 'blue';
	ctx.fillRect(row * 50, col * 50, width, height);
}

function draw() {
	ctx.clearRect(0, 0, c.width, c.height);

	for (var row = 0; row < 11; row++) {
		for (var col = 0; col < 11; col++) {
			ctx.fillStyle = 'black';
			ctx.fillRect(row * 50, col * 50, 50, 50);

			blockadeTrue(row, col);
			coinsTrue(row, col);

		}
	}

	howIsRotate();
	ctx.drawImage(imgbad1, currentColBad * 50, currentRowBad * 50, 50, 50);
}

function life() {
	if (currentCol == currentColBad && currentRow == currentRowBad) {
		if (lifes > 0) {
			lifes--;
		} else {
			ctx2.clearRect(0, 0, c2.width, c2.height);
			drawForTheEnd('GAME OVER!');
			clearInterval(tr);
			clearInterval(b);
		}
	}
}

function win() {
	for (var row = 0; row < 11; row++) {
		for (var col = 0; col < 11; col++) {
			if (coins[row][col]) {
				return;
			}
		}
	}
	ctx2.clearRect(0, 0, c2.width, c2.height);
	if (lifes != 0) {
		drawForTheEnd('YOU WIN!');
		clearInterval(tr);
		clearInterval(b);
	} else {
		drawForTheEnd('GAME OVER!');
	}
}

function drawForTheEnd(end) {
	ctx2.clearRect(0, 0, c2.width, c2.height);
	var x = c2.width / 2;
	var y = c2.height / 2;
	ctx2.fillStyle = 'black';
	ctx2.fillRect(0, 0, 80, 50);
	ctx2.fillRect(52, 0, 80, 50);
	ctx2.drawImage(imgPacman, 10, 10, 30, 30);
	ctx2.fillRect(205, 0, 80, 50);
	ctx2.fillRect(257, 0, 80, 50);
	ctx2.drawImage(imgCoin, 215, 10, 30, 30);
	ctx2.font = '30pt Calibri';
	ctx2.textAlign = 'center';
	ctx2.fillStyle = 'red';
	ctx2.fillText(lifes, 65, 40);
	ctx2.fillText(points, 275, 40);
	ctx2.fillText(end, x, y);
}

function canMoveBad(nb1, nb2) {
	if (!blockade[currentColBad + nb1][currentRowBad + nb2]) {
		return true;
	}
}

function moveBad() {
	checkRowBad();
	checkColBad();
}

function checkRowBad() {
	if (currentRow > currentRowBad && currentRowBad < 10) {
		if (canMoveBad(0, 1)) {
			currentRowBad++;
			draw();
			life();
		}
	} else if (currentRow < currentRowBad && currentRowBad > 0) {
		if (canMoveBad(0, -1)) {
			currentRowBad--;
			draw();
			life();
		}
	}
}

function checkColBad() {
	if (currentCol > currentColBad && currentColBad < 10) {
		if (canMoveBad(1, 0)) {
			currentColBad++;
			draw();
			life();
		}
	} else if (currentCol < currentColBad && currentColBad > 0) {
		if (canMoveBad(-1, 0)) {
			currentColBad--;
			draw();
			life();
		}
	}
}

function afterMoved() {
	if (coins[currentCol][currentRow]) {
		coins[currentCol][currentRow] = false;
		points++;
	}
	if (currentRow == 5 && currentCol == 3 && rotLife) {
		lifes++;
		clearInterval(l);
		draw();
		rotLife = false;
	} else if (currentRow == 5 && currentCol == 7 && rotIceCream) {
		clearInterval(ic);
		if (i) {
			clearInterval(b);
			i = false;
			draw();
			rotIceCream = false;
		}
	}
	if (!i) {
		if (t == 0) {
			b = setInterval(moveBad, 500);
			i = true;
		} else {
			t--;
		}
	}
	draw();
	win();

}

function moveDown() {
	pravec = 'd';
	if (currentRow < 10 && !blockade[currentCol][currentRow + 1]) {
		currentRow++;
		afterMoved();
	}
}

function moveUp() {
	pravec = 'u';
	if (currentRow > 0 && !blockade[currentCol][currentRow - 1]) {
		currentRow--;
		afterMoved();
	}
}

function moveLeft() {
	pravec = 'l';
	if (currentCol > 0 && !blockade[currentCol - 1][currentRow]) {
		currentCol--;
		afterMoved();
	}
}

function moveRight() {
	pravec = 'r';
	if (currentCol < 10 && !blockade[currentCol + 1][currentRow]) {
		currentCol++;
		afterMoved();
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

function start() {

	currentRow = 0;
	currentCol = 0;
	currentRowBad = 0;
	currentColBad = 10;
	coins = [];
	points = 0;
	pravec = 'r';
	blockade = [];
	lifes = 3;
	time = 30;
	i = true;
	angle = 0;
	t = 25;
	rotLife = true;
	rotIceCream = true;

	pushValueBlockade();
	pushValueCoins();
	draw();
	document.onkeypress = pritisna;
	tr = setInterval(timer, 1000);
	b = setInterval(moveBad, 500);
	l = setInterval(rotateLife, 500);
	ic = setInterval(rotateIceCream, 500);
}

function rotateLife() {
	angle += 25;
	draw();
	ctx.save();
	ctx.translate(175, 275);
	ctx.rotate(angle * Math.PI / 180);
	ctx.drawImage(imgPacmanLife, -15, -15, 30, 30);
	ctx.restore();
}

function rotateIceCream() {
	angle += 25;
	ctx.save();
	ctx.translate(375, 275);
	ctx.rotate(angle * Math.PI / 180);
	ctx.drawImage(imgIceCream, -25, -25, 50, 50);
	ctx.restore();
}
start();
$('#pacman').hide();
$('#pacmanLife').hide();
$('#coin').hide();
$('#bad1').hide();
$('#iceCream').hide();
