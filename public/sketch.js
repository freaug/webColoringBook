let img;
let pg;

let c;

let drawSize;

let cnv;

let socket;

let shouldMove = false;

let button, slider, colorPicker;

function preload() {
  img = loadImage("assets/lines.png");
}

function setup() {
  cnv = createCanvas(390, 553);
  cnv.parent("sketch-holder");
//  cnv.style("display", "block");

  pg = createGraphics(495, 553);

  noCursor();

  colorPicker = createColorPicker("#4C99FF");
  colorPicker.parent("controls");

  button = createButton("save");
  button.parent("controls");
  button.size(50, 23);
  button.mousePressed(save);

  slider = createSlider(10, 50, 25);
  slider.parent("controls");
  slider.style("width", "100px");

  drawSize = 20;

  socket = io.connect();
  socket.on(
    "mouse",
    // When we receive data
    function(data) {
      // Draw a blue circle
      pg.fill(data.r, data.g, data.b);
      pg.stroke(data.r, data.g, data.b);
      pg.strokeWeight(data.size);
      pg.line(data.x, data.y, data.px, data.py);
    }
  );
}

function touchStarted() {
  push();
  pg.fill(colorPicker.color());
  pg.stroke(colorPicker.color());
  pg.strokeWeight(drawSize);
  pg.line(mouseX, mouseY, pmouseX, pmouseY);
  pop();

  let red = colorPicker.color().levels[0];
  let green = colorPicker.color().levels[1];
  let blue = colorPicker.color().levels[2];

  sendmouse(mouseX, mouseY, pmouseX, pmouseY, red, green, blue, drawSize);
}

function touchMoved() {
  push();
  pg.fill(colorPicker.color());
  pg.stroke(colorPicker.color());
  pg.strokeWeight(drawSize);
  pg.line(mouseX, mouseY, pmouseX, pmouseY);
  pop();

  let red = colorPicker.color().levels[0];
  let green = colorPicker.color().levels[1];
  let blue = colorPicker.color().levels[2];

  sendmouse(mouseX, mouseY, pmouseX, pmouseY, red, green, blue, drawSize);

  return shouldMove;
}

//data we send to the server
function sendmouse(xpos, ypos, pxpos, pypos, red, green, blue, size) {
  var data = {
    x: xpos,
    y: ypos,
    px: pxpos,
    py: pypos,
    r: red,
    g: green,
    b: blue,
    size: drawSize
  };

  socket.emit("mouse", data);
}

function draw() {
  //get size of drawing thing
  drawSize = slider.value();
  //only draw if we click or drag
  background(255);
  //position our drawing layer
  image(pg, 0, 0);
  //cursor
  push();
  noStroke();
  fill(colorPicker.color());
  ellipse(mouseX, mouseY, drawSize, drawSize);
  pop();
  //position image on top
  image(img, 0, 0);

  if (touches.length > 0) {
    if(touches[0].y > cnv.height || touches[0].y < 0 || touches[0].x < 0 || touches[0].x > cnv.width){
      shouldMove = true;
    }else{
      shouldMove = false;
    }
  }
  if(touches.length == 0){
    shouldMove = true;
  }
}
