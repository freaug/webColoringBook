let img;
let pg;

let c;

let drawSize;

let cnv;

let socket;

let button, slider, colorPicker;

function preload() {
  img = loadImage("assets/lines.png");
}

function setup() {
  cnv = createCanvas(600, 600);
  cnv.parent("sketch-holder");

  pg = createGraphics(600, 600);

  noCursor();

  colorPicker = createColorPicker("#4C99FF");
  colorPicker.parent("controls");

  button = createButton("save");
  button.parent("controls");
  button.size(50, 23);
  button.mousePressed(save);

  slider = createSlider(0, 255, 20);
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
  
  return false;

}




function sendmouse(xpos, ypos, pxpos, pypos, red, green, blue, size) {
  // We are sending!
  console.log(
    "sendmouse: " +
      xpos +
      " " +
      ypos +
      " " +
      red +
      " " +
      green +
      " " +
      blue +
      " " +
      size
  );

  // Make a little object with  and y
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

  // Send that object to the socket
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
}
