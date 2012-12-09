
//start screen
//levels menu
//top scores for each level
//load proper board

//board logic
//pull beads down and push to left

var canvas;
var stage;
var screen_width;
var screen_height;
var bmp;

var image1 = new Image();

function init() {
    canvas = document.getElementById("gameCanvas");

    image1.onload = handleImageLoad;
    image1.onerror = handleImageError;
    image1.src = "img/dot_A.png";
}

function handleImageLoad(e) {
    startGame();
}

function handleImageError(e) {
    console.log("Error loading image : " + e.target.src);
}

function startGame() {
    stage = new createjs.Stage(canvas);

    screen_width = canvas.width;
    screen_height = canvas.height;

    bmp = new createjs.Bitmap(image1);
    bmp.regX = 25;
    bmp.regY = 25;
    bmp.x = 300;
    bmp.y = 150;
    bmp.vX = 1;
    
    stage.addChild(bmp);
    stage.update();

    createjs.Ticker.addListener(window);
    createjs.Ticker.useRAF = true;
    createjs.Ticker.setFPS(60);
}

function checkCollision() {
    if (bmp.x > screen_width)
        bmp.vX = -1;
    else if (bmp.x < 0)
        bmp.vX = 1;
}

function tick() {
    checkCollision();
    bmp.x += bmp.vX;
    stage.update();
}

window.onload = function () {
    init();
    console.log("yay");
};