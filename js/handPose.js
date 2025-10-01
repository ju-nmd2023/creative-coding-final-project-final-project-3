//Example and inspiration taken from: https://editor.p5js.org/ml5/sketches/fnboooD-K

let hands = [];
let handPose;
let video;
let connections;

function preload() {
  // Load the handPose model
  handPose = ml5.handPose();
}

function setup() {
  createCanvas(640, 480);
  // Create the webcam video and hide it
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  // start detecting hands from the webcam video
  handPose.detectStart(video, gotHands);
  // Get the skeletal connection information
  connections = handPose.getConnections();
}

function draw() {
  // Draw the webcam video
  let fingerTips = [4, 8, 12, 16, 20];
  //The following 5 lines of code were provided by Evelline Miyamoto
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();

  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];

    //  The following 2 lines of code was taken from ChatGPT 2025-09-23: https://chatgpt.com/share/68d2f068-c8c0-800d-b0c8-f5189dfd007c
    // Shorthand for if-else statement. If hand is left, fill 0,0,255 else fill 255,0,0
    fill(hand.handedness === "Left" ? [0, 0, 255] : [255, 0, 0]);

    for (let j = 0; j < fingerTips.length; j++) {
      let keypoint = hand.keypoints[fingerTips[j]];
      noStroke();
      circle(width - keypoint.x, keypoint.y, 10);
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

// Callback function for when handPose outputs data
function gotHands(results) {
  // save the output to the hands variable
  hands = results;
}

//Inspiration taken from Lecture 1: Generative Artists
// the following word "isRightHand" was taken from ChatGPT 2025-09-23: https://chatgpt.com/share/68d2af4b-1e68-800d-b03b-515fe2884092
function noiseLine(x1, y1, x2, y2, isRightHand) {
  let steps = 50;

  // the following 1 line of code was taken from ChatGPT 2025-09-23: https://chatgpt.com/share/68d2af4b-1e68-800d-b03b-515fe2884092
  let mid = Math.floor(steps / 2);

  noFill();
  strokeWeight(3);

  //right hand color peril noise line
  // the following 1 line of code was taken from ChatGPT 2025-09-23: https://chatgpt.com/share/68d2af4b-1e68-800d-b03b-515fe2884092
  stroke(isRightHand ? [255, 0, 0] : [255, 0, 0]);
  beginShape();
  // the following 1 line of code was taken from ChatGPT 2025-09-23: https://chatgpt.com/share/68d2af4b-1e68-800d-b03b-515fe2884092
  for (let i = 0; i <= mid; i++) {
    let t = i / steps;
    let x = lerp(x1, x2, t);
    let y = lerp(y1, y2, t);

    let offset = noise(x * 0.1, y * 0.1, frameCount * 0.02) * 40 - 20;
    vertex(x, y + offset);
  }
  endShape();

  //left hand color peril noise line
  // the following 1 line of code was taken from ChatGPT 2025-09-23: https://chatgpt.com/share/68d2af4b-1e68-800d-b03b-515fe2884092
  stroke(isRightHand ? [0, 0, 255] : [0, 0, 255]);

  beginShape();
  // the following 1 line of code was taken from ChatGPT 2025-09-23: https://chatgpt.com/share/68d2af4b-1e68-800d-b03b-515fe2884092
  for (let i = mid; i <= steps; i++) {
    let t = i / steps;
    let x = lerp(x1, x2, t);
    let y = lerp(y1, y2, t);

    let offset = noise(x * 0.1, y * 0.1, frameCount * 0.02) * 40 - 20;
    vertex(x, y + offset);
  }
  endShape();
}
