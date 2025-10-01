// The following code is isnpired by Teacher Assistent Evellin Miyamoto portfolio example from 2024.

function setup() {
	createCanvas(innerWidth, innerHeight);
	frameRate(10);
}

const size = 100;
const layers = 50;
let counter = 0;

function getRandomValue(pos, variance) {
	return pos + map(Math.random(), 0, 1, -variance, variance);
}

function drawLayers(x, y, size, layers) {
	const variance = size / 20;
	noFill();

	for (let i = 0; i < layers; i++) {
		if (Math.random() > 0.8) {
			continue;
		}

		const s = (size / layers) * i;
		const half = s / 2;

		beginShape();
		vertex(
			getRandomValue(x - half, variance),
			getRandomValue(y - half, variance)
		);
		vertex(
			getRandomValue(x + half, variance),
			getRandomValue(y - half, variance)
		);
		vertex(
			getRandomValue(x + half, variance),
			getRandomValue(y + half, variance)
		);
		vertex(
			getRandomValue(x - half, variance),
			getRandomValue(y + half, variance)
		);

		endShape(CLOSE);
	}
}

// function drawMolnar() {
// 	// The following 3 lines of code was taken from ChatGPT 2025-09-10: https://chatgpt.com/share/68c122d1-1e98-800d-a675-ba35fe4bf96d
// 	let gridWidth = size * 10;
// 	let gridHeight = size * 10;
// 	translate((width - gridWidth) / 2, (height - gridHeight) / 2);

// 	stroke(255, 255, 255);
// 	background(10, 10, 10);

// 	for (let y = 0; y < 10; y++) {
// 		for (let x = 0; x < 10; x++) {
// 			stroke(random(255), random(255), random(255));
// 			drawLayers(size / 2 + x * size, size / 2 + y * size, size, layers);
// 		}
// 	}
// 	counter += 0.01;
// 	// noLoop();
// }

function draw() {
	// clear();

	// The following 3 lines of code was taken from ChatGPT 2025-09-10: https://chatgpt.com/share/68c122d1-1e98-800d-a675-ba35fe4bf96d
	let gridWidth = size * 10;
	let gridHeight = size * 10;
	translate((width - gridWidth) / 2, (height - gridHeight) / 2);

	stroke(255, 255, 255);
	background(10, 10, 10);

	for (let y = 0; y < 10; y++) {
		for (let x = 0; x < 10; x++) {
			stroke(random(255), random(255), random(255));
			drawLayers(size / 2 + x * size, size / 2 + y * size, size, layers);
		}
	}
	counter += 0.01;
	// noLoop();
}
