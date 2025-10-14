//Example and inspiration taken from: https://editor.p5js.org/ml5/sketches/fnboooD-K

// * GLOBAL VARIALBES
let hands = [];
let handPose;
let video;
let connections;

//Next 3 lines taken from: https://chatgpt.com/share/68eca32d-7480-800d-9944-2fb8d9f18c70 13/10/2025
let leftSynth;
let rightSynth;
let toneStarted = false;

// * VARIABLES FOR drawMolnar
const size = 100;
const layers = 50;
let counter = 0;

function preload() {
  // * Load the handPose model
  handPose = ml5.handPose();
}

function setup() {
  createCanvas(640, 480);
  // * Create the webcam video and hide it
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  // * start detecting hands from the webcam video
  handPose.detectStart(video, gotHands);
  // * Get the skeletal connection information
  connections = handPose.getConnections();
  // * Framerate for drawMolnar
  // frameRate(10);

  //Next 9 lines of code were through the help of Bassima Basma Ghassan 13/10/2025
  // * Setup synths
  if (typeof Tone !== "undefined") {
    leftSynth = new Tone.MonoSynth({
      oscillator: { type: "sine" },
      envelope: { attack: 0.1, release: 0.5 },
    }).toDestination();

    rightSynth = new Tone.MonoSynth({
      oscillator: { type: "square" },
      envelope: { attack: 0.05, release: 0.3 },
    }).toDestination();
  }
}

//Next 7 lines of code were through the help of Bassima Basma Ghassan 13/10/2025
function mousePressed() {
  if (!toneStarted) {
    Tone.start();
    toneStarted = true;
    console.log("Tone.js started");
  }
}

// * Callback function for when handPose outputs data
function gotHands(results) {
  // save the output to the hands variable
  hands = results;
}

//Next 17 lines of code are taken from: https://chatgpt.com/share/68eca32d-7480-800d-9944-2fb8d9f18c70 13/10/2025
function handSoundController() {
  for (let hand of hands) {
    let indexTip = hand.keypoints[8]; // Index finger tip
    let handX = width - indexTip.x;
    let handY = indexTip.y;

    // * Map position to MIDI note and volume
    let midiNote = map(handX, 0, width, 40, 80); // width pitch range)
    let note = Tone.Frequency(midiNote, "midi").toNote();
    let volume = map(handY, 0, height, -12, 0); // height volume range

    // * Determine which synth to use based on hand

    if (hand.handedness === "left") {
      leftSynth.triggerAttackRelease(note, "8n");
      leftSynth.volume.value = volume;
    } else {
      rightSynth.triggerAttackRelease(note, "8n");
      rightSynth.volume.value = volume;
    }
  }
}

// Inspiration taken from Lecture 1: Generative Artists
function noiseLine(x1, y1, x2, y2) {
  let steps = 50;
  noFill();
  strokeWeight(3);

  // Distance between fingertips
  let distBetween = dist(x1, y1, x2, y2);

  //https://p5js.org/examples/calculating-values-map/
  let noiseAmp = map(distBetween, 0, 400, 10, 100, true);

  stroke(255);

  beginShape();
  for (let i = 0; i <= steps; i++) {
    let t = i / steps;
    let x = lerp(x1, x2, t);
    let y = lerp(y1, y2, t);

    let offset =
      noise(x * 0.1, y * 0.1, frameCount * 0.02) * noiseAmp - noiseAmp / 2;
    vertex(x, y + offset);
  }
  endShape();
}

// * getRandomValue and drawLayers is for drawMolnar and was taken from portfolio variation molnar
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

// The following 4 lines of code was taken from ChatGPT 2025-10-01: https://chatgpt.com/share/68dd1597-dddc-800d-bda2-79c3a17af677
function drawMolnar(x, y, size, layers) {
  strokeWeight(1);
  stroke(255);
  drawLayers(x, y, size, layers);

  counter += 0.01;
}

function drawWebcamVideo() {
  // * Draw the webcam video
  let fingerTips = [4, 8, 12, 16, 20];
  //The following 5 lines of code were provided by Evelline Miyamoto
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();

  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];

    //  The following 1 lines of code was taken from ChatGPT 2025-09-23: https://chatgpt.com/share/68d2f068-c8c0-800d-b0c8-f5189dfd007c
    fill(hand.handedness === "left" ? [0, 0, 255] : [255, 0, 0]); // Shorthand for if-else statement.

    for (let j = 0; j < fingerTips.length; j++) {
      let keypoint = hand.keypoints[fingerTips[j]];
      noStroke();

      // * Draw fingertip circles/molnar
      drawMolnar(width - keypoint.x, keypoint.y, 30, 10);
    }
  }

  if (hands.length === 2) {
    let handA = hands[0];
    let handB = hands[1];

    for (let j = 0; j < fingerTips.length; j++) {
      let pointA = handA.keypoints[fingerTips[j]];
      let pointB = handB.keypoints[fingerTips[j]];
      stroke(0, 255, 255);
      strokeWeight(3);
      noiseLine(width - pointA.x, pointA.y, width - pointB.x, pointB.y);
    }
  }
}

function draw() {
  drawWebcamVideo();
  handSoundController();
}
