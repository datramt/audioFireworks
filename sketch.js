let threeDpanner;
let noiz;
let listener;
let fft;
let rotator = 0;
let innerR;
let outerR;
let stars = [];

function setup() {
  createCanvas(innerWidth, innerHeight);
  innerR = 20;
  outerR = 10;
  noiz = new p5.Noise('brown');
  angleMode(DEGREES);
  noCursor();
  noiz.amp(0.1);
  // noiz.freq(50);
  noiz.disconnect();
  noiz.start();
  threeDpanner = new p5.Panner3D;
  threeDpanner.process(noiz);
  listener = p5.soundOut.audiocontext.listener;
  // threeDpanner.setFalloff(1000, 100);
  print(listener);
  print(threeDpanner);

  fft = new p5.FFT(0, 64);
  fft.setInput(noiz);

  // Instantiate the envelope
  envelope = new p5.Env();
  envelope.setRange(1, 0);

  // set attackTime, decayTime, sustainRatio, releaseTime
  envelope.setADSR(0.001, 1, 0, 0.5);
  envelope.play(noiz, 0, 0.1);

  for (let x = 0; x < 100; x++) {
    stars[x] = [];
    for (let y = 0; y < 100; y++) {
      stars[x][y] = random(0, 0.1);

    }
  }

}

function draw() {
  background(20);

  for (let x = 0; x < 100; x++) {
    for (let y = 0; y < 100; y++) {
      if (stars[x][y] >= 0.099) {
        point(x*width/100, y*width/100);
      }
    }
  }

  let spectrum = fft.analyze();
  stroke(255);
  strokeWeight(2);
  rotator+= 0.1;
  push();
  translate(mouseX, mouseY);
  rotate(rotator);
  innerR = 0;
  for (var i = 0; i < spectrum.length; i++) {
    stroke(255-spectrum[i], spectrum[i], 255-spectrum[i]);
    // stroke(200);
    innerR += spectrum[i]*0.04;
    line(0, map(spectrum[i]*-1, 0, 255, innerR, outerR), 0,innerR );

    rotate(4992/spectrum.length);

  }
  pop();


  let correctedMouseX = 2*(mouseX-width/2)*360/width;
  let correctedMouseY = -1*(mouseY-height/2)*360/width;
  threeDpanner.set(correctedMouseX, correctedMouseY, 100, 0.05);


}

function mousePressed() {

  envelope.play(noiz, 0, 0.1);
  innerR = 0;
}

function touchStarted() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
}
