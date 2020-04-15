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
    cnv.parent('sketch-holder');

    pg = createGraphics(600, 600);

    noCursor();

    colorPicker = createColorPicker('#4C99FF');
    colorPicker.parent('controls');

    button = createButton('save');
    button.parent('controls');
    button.size(50, 23);
    button.mousePressed(save);

    slider = createSlider(0, 255, 20);
    slider.parent('controls');
    slider.style('width', '100px');

    drawSize = 20;


    socket = io.connect('http://localhost:3000');
    socket.on('mouse',
        // When we receive data
        function(data) {
            console.log("Got: " + data.x + " " + data.y + " " + data.r + " " + data.g + " " + data.b + " " + data.size);
            // Draw a blue circle
            pg.fill(data.r, data.g, data.b);
            pg.noStroke();
            pg.ellipse(data.x, data.y, data.size, data.size);
        }
    );
}

function mouseDragged() {
    push();
    pg.noStroke();
    pg.fill(colorPicker.color());
    pg.ellipse(mouseX, mouseY, drawSize, drawSize);
    pop();

    let red = colorPicker.color().levels[0];
    let green = colorPicker.color().levels[1];
    let blue = colorPicker.color().levels[2];

    drawSize = slider.value();

    sendmouse(mouseX, mouseY, red, green, blue, drawSize);
}

function mousePressed() {
    push();
    pg.noStroke();
    pg.fill(colorPicker.color());
    pg.ellipse(mouseX, mouseY, drawSize, drawSize);
    pop();

    let red = colorPicker.color().levels[0];
    let green = colorPicker.color().levels[1];
    let blue = colorPicker.color().levels[2];

    drawSize = slider.value();

    sendmouse(mouseX, mouseY, red, green, blue, drawSize);

}

function sendmouse(xpos, ypos, red, green, blue, size) {
    // We are sending!
    console.log("sendmouse: " + xpos + " " + ypos + " " + red + " " + green + " " + blue + " " + size);

    // Make a little object with  and y
    var data = {
        x: xpos,
        y: ypos,
        r: red,
        g: green,
        b: blue,
        size: drawSize
    };

    // Send that object to the socket
    socket.emit('mouse', data);
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