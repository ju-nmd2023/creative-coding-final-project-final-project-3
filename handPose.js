//Example and inspiration taken from: https://editor.p5js.org/ml5/sketches/fnboooD-K

let handPose;
let video;
let hands = [];
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

  // Draw the skeletal connections
  // for (let i = 0; i < hands.length; i++) {
  //   let hand = hands[i];
  //   for (let j = 0; j < connections.length; j++) {
  //     let pointAIndex = connections[j][0];
  //     let pointBIndex = connections[j][1];
  //     let pointA = hand.keypoints[pointAIndex];
  //     let pointB = hand.keypoints[pointBIndex];
  //     stroke(255, 0, 0);
  //     strokeWeight(2);
  //     line(pointA.x, pointA.y, pointB.x, pointB.y);
  //   }
  // }

  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];

    for (let j = 0; j < fingerTips.length; j++) {
      let keypoint = hand.keypoints[fingerTips[j]];
      fill(0, 255, 0);
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
function noiseLine(x1, y1, x2, y2) {
  let steps = 50;
  noFill();
  stroke(0, 255, 255);
  strokeWeight(3);

  beginShape();
  for (let i = 0; i <= steps; i++) {
    let t = i / steps;
    let x = lerp(x1, x2, t);
    let y = lerp(y1, y2, t);

    let offset = noise(x * 0.1, y * 0.1, frameCount * 0.02) * 40 - 20;
    vertex(x, y + offset);
  }
  endShape();
}
