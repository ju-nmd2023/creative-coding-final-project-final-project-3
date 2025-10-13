// --- NEW: audio globals ---
let osc,
  env,
  audioOn = false;
let prevTip = null;
let smoothedFreq = 220; // start near A3
let smoothedAmp = 0.0;

// --- NEW: user gesture to unlock audio ---
function mousePressed() {
  initAudio();
}
function touchStarted() {
  initAudio();
}
function initAudio() {
  if (audioOn) return;
  try {
    getAudioContext().resume();
  } catch (e) {}
  osc = new p5.Oscillator("sine"); // try 'triangle' for a softer tone
  env = new p5.Envelope(0.001, 1.0, 0.08, 0.2); // quick attack, short release
  osc.start();
  osc.amp(0); // start silent
  audioOn = true;
}

//Example and inspiration taken from: https://editor.p5js.org/ml5/sketches/fnboooD-K

// * GLOBAL VARIALBES
let hands = [];
let handPose;
let video;
let connections;

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
  frameRate(60);
}

// * Callback function for when handPose outputs data
function gotHands(results) {
  // save the output to the hands variable
  hands = results;
}

// Inspiration taken from Lecture 1: Generative Artists
// the following word "isRightHand" was taken from ChatGPT 2025-09-23: https://chatgpt.com/share/68d2af4b-1e68-800d-b03b-515fe2884092
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
    fill(hand.handedness === "Left" ? [0, 0, 255] : [255, 0, 0]); // Shorthand for if-else statement.

    for (let j = 0; j < fingerTips.length; j++) {
      let keypoint = hand.keypoints[fingerTips[j]];
      noStroke();

      // * Draw fingertip circles/molnar
      drawMolnar(width - keypoint.x, keypoint.y, 30, 10);
    }
    if (audioOn) {
      let moving = false;

      if (hands.length > 0 && hands[0].keypoints && hands[0].keypoints[8]) {
        // mirror-x like your visuals
        const tip = {
          x: width - hands[0].keypoints[8].x,
          y: hands[0].keypoints[8].y,
        };

        // Movement magnitude to gate sound
        if (prevTip) {
          const dx = tip.x - prevTip.x;
          const dy = tip.y - prevTip.y;
          const speed = Math.hypot(dx, dy);

          // Map X -> frequency (MIDI-ish 60–84 ≈ 261–1046 Hz)
          const freq = map(tip.x, 0, width, 200, 1200, true);
          // Map Y -> amplitude (top loud, bottom quiet)
          const amp = map(tip.y, 0, height, 0.9, 0.05, true);

          // Smooth to avoid jitter (one-pole low-pass)
          smoothedFreq = lerp(smoothedFreq, freq, 0.25);
          smoothedAmp = lerp(smoothedAmp, amp, 0.25);

          osc.freq(smoothedFreq);

          // Only “speak” when moving a bit; tweak threshold to taste
          const movingThreshold = 1.5;
          moving = speed > movingThreshold;

          if (moving) {
            // shape amplitude with envelope for clarity on movement
            osc.amp(smoothedAmp, 0.02); // quick ramp
          } else {
            osc.amp(0.0, 0.08); // gentle fade when still
          }
        }
        prevTip = tip;
      } else {
        // No hand: fade out
        osc && osc.amp(0.0, 0.1);
        prevTip = null;
      }
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
  } else {
    // translate(0, 0);
    background(0);
    fill(255);
    textAlign(CENTER, CENTER);
    text("Please show two hands!", width / 2, height / 2);
    scale(-1, 1);
  }
}

function draw() {
  drawWebcamVideo();
}
