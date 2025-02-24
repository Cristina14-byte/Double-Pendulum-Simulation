let r1 = 125;
let r2 = 125;
let m1 = 10;
let m2 = 10;
let a1 = 0.001;
let a2 = 0.001;
let a1_v = 0;
let a2_v = 0;
let g = 1;
let px1, py1, px2, py2;
let isPaused = false;
let zoomFactor = 1;

let cx, cy;
let buffer;
let resetButton, pauseButton;

function setup() {
  createCanvas(500, 400);
  pixelDensity(1);
  a1 = PI / 2;
  a2 = PI / 2;
  cx = width / 2;
  cy = 50;
  buffer = createGraphics(width, height);
  buffer.background(0, 128, 224);
  buffer.translate(cx, cy);

  resetButton = createButton('Reset');
  resetButton.position(540, 430);
  resetButton.size(80, 40);
  resetButton.style('background-color', 'red');
  resetButton.style('color', 'white');
  resetButton.style('border', 'none');
  resetButton.style('padding', '10px 20px');
  resetButton.style('text-align', 'center');
  resetButton.style('text-decoration', 'none');
  resetButton.style('display', 'inline-block');
  resetButton.style('font-size', '16px');
  resetButton.style('cursor', 'pointer');
  resetButton.style('border-radius', '5px');
  resetButton.mousePressed(resetSimulation);

  pauseButton = createButton('Pause');
  pauseButton.position(450,430); 
  pauseButton.size(80, 40);
  pauseButton.style('background-color', 'orange');
  pauseButton.style('color', 'white');
  pauseButton.style('border', 'none');
  pauseButton.style('padding', '10px 20px');
  pauseButton.style('text-align', 'center');
  pauseButton.style('text-decoration', 'none');
  pauseButton.style('display', 'inline-block');
  pauseButton.style('font-size', '16px');
  pauseButton.style('cursor', 'pointer');
  pauseButton.style('border-radius', '5px');
  pauseButton.mousePressed(togglePause);

  px1 = r1 * sin(a1);
  py1 = r1 * cos(a1);
  px2 = px1 + r2 * sin(a2);
  py2 = py1 + r2 * cos(a2);
}

function draw() {
  if (!isPaused) {
    imageMode(CORNER);
    image(buffer, 0, 0, width, height);

    scale(zoomFactor);
    
    strokeWeight(8);
    stroke(0);
    line(cx - 50, cy + 300, cx + 50, cy + 300);
    line(cx, cy, cx, cy + 300);

    let num1 = -g * (2 * m1 + m2) * sin(a1);
    let num2 = -m2 * g * sin(a1 - 2 * a2);
    let num3 = -2 * sin(a1 - a2) * m2;
    let num4 = a2_v * a2_v * r2 + a1_v * a1_v * r1 * cos(a1 - a2);
    let den = r1 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2));
    let a1_a = (num1 + num2 + num3 * num4) / den;

    num1 = 2 * sin(a1 - a2);
    num2 = (a1_v * a1_v * r1 * (m1 + m2));
    num3 = g * (m1 + m2) * cos(a1);
    num4 = a2_v * a2_v * r2 * m2 * cos(a1 - a2);
    den = r2 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2));
    let a2_a = (num1 * (num2 + num3 + num4)) / den;

    translate(cx, cy);
    stroke(0);
    strokeWeight(2);

    let x1 = r1 * sin(a1);
    let y1 = r1 * cos(a1);

    let x2 = x1 + r2 * sin(a2);
    let y2 = y1 + r2 * cos(a2);

    drawVelocityVectors(x1, y1, a1_v * r1 * cos(a1), -a1_v * r1 * sin(a1), m1);
    drawVelocityVectors(x2, y2, (a1_v * r1 + a2_v * r2) * cos(a2), -(a1_v * r1 + a2_v * r2) * sin(a2), m2);

    stroke(0);
    line(0, 0, x1, y1);
    fill(0);
    ellipse(x1, y1, m1 * 2, m1 * 2);

    line(x1, y1, x2, y2);
    fill(0);
    ellipse(x2, y2, m2 * 2, m2 * 2);

    a1_v += a1_a;
    a2_v += a2_a;
    a1 += a1_v;
    a2 += a2_v;

    buffer.stroke(102, 255, 102);
    buffer.line(px2, py2, x2, y2);

    px2 = x2;
    py2 = y2;

    buffer.stroke(255, 128, 0);
    buffer.line(px1, py1, x1, y1);

    px1 = x1;
    py1 = y1;

    textSize(24);
    fill(0);
    text('Double Pendulum Simulation', -160, -20);

    noStroke();
    textSize(16);
    fill('red');
    text('The red vectors represent', -220, 270);
    textSize(16);
    fill('red');
    text('the velocity vectors.', -220, 287);
    
    noStroke();
    textSize(16);
    fill('black');
    text('Inspired by Daniel Schiffman\'s code', -220, 330);
  }
}

function drawVelocityVectors(x, y, vx, vy, mass) {
  let vMagnitude = dist(0, 0, vx, vy);
  let scale = 15;
  let scaledVx = vx * scale * 3 / vMagnitude;
  let scaledVy = vy * scale * 3 / vMagnitude;
  stroke(255, 0, 0);
  strokeWeight(2);
  line(x, y, x + scaledVx, y + scaledVy);

  let arrowSize = 7;
  push();
  translate(x + scaledVx, y + scaledVy);
  rotate(atan2(scaledVy, scaledVx));
  triangle(-arrowSize, -arrowSize / 2, 0, 0, -arrowSize, arrowSize / 2);
  pop();

  fill(0);
  ellipse(x, y, mass * 2, mass * 2);
}

function resetSimulation() {
  isPaused = false;
  a1 = PI / 2;
  a2 = PI / 2;
  a1_v = 0;
  a2_v = 0;

  px1 = r1 * sin(a1);
  py1 = r1 * cos(a1);
  px2 = px1 + r2 * sin(a2);
  py2 = py1 + r2 * cos(a2);

  buffer.background(0, 128, 224);
}

function togglePause() {
  isPaused = !isPaused;
}