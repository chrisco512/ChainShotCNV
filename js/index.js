
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
var bmps;

var images;
var board = [["R", "R", "G"], ["R", "G", "B"], ["Y", "Y", "B", "O"], ["Y", "O", "B"], ["Y", "O", "B"]];
var loadCnt = 0;


function init() {
    canvas = document.getElementById("gameCanvas");

    images = new Array(board.length);
    for (var i = 0; i < board.length; i++) {
        images[i] = new Array(board[i].length);
        for (var j = 0; j < board[i].length; j++) {
            images[i][j] = new Image();
            images[i][j].onload = handleImageLoad;
            images[i][j].onerror = handleImageError;
            images[i][j].src = "img/dot_" + board[i][j] + ".png";
        }
    }
}

function handleImageLoad(e) {
    loadCnt++;
    if(loadCnt === 9)
        startGame();
}

function handleImageError(e) {
    console.log("Error loading image : " + e.target.src);
}

function startGame() {
    stage = new createjs.Stage(canvas);

    screen_width = canvas.width;
    screen_height = canvas.height;

    bmps = new Array(board.length);

    for (var i = 0; i < board.length; i++) {
        bmps[i] = new Array(board[i].length);
        for (var j = 0; j < board[i].length; j++) {
            var bmp = new createjs.Bitmap(images[i][j]);

            bmp.regX = bmp.image.width / 2;
            bmp.regY = bmp.image.height / 2;
       
            bmp.scaleX = (screen_width / board.length) / bmp.image.width;
            bmp.scaleY = (screen_height / board.length) / bmp.image.height;

            bmp.x = (bmp.image.width/2 + i * bmp.image.width) * bmp.scaleX;
            bmp.y = screen_height - bmp.scaleY * (bmp.image.height/2 + j * bmp.image.height);

            bmps[i][j] = bmp;
            stage.addChild(bmps[i][j]);
        }
    }

    //bmp = new createjs.Bitmap(
    //    );
    //bmp.regX = 25;
    //bmp.regY = 25;
    //bmp.x = 300;
    //bmp.y = 150;
    //bmp.vX = -25;
    //bmp.vY = 25;
    //bmp.properX = 20;
    //bmp.properY = 540;
    //bmp.shadow = new createjs.Shadow("#454", 0, 5, 4);

    
    stage.update();
    //
    createjs.Ticker.addListener(window);
    createjs.Ticker.useRAF = true;
    createjs.Ticker.setFPS(60);
}

function checkCollision() {
    if (bmp.x < (bmp.properX + bmp.image.width/2)) {
        bmp.x = bmp.properX + bmp.image.width / 2;
    }

    if (bmp.y > (bmp.properY - bmp.image.height / 2)) {
        bmp.y = bmp.properY - bmp.image.height / 2;
    }
}

function tick() {
    //bmp.x += bmp.vX;
    //bmp.y += bmp.vY;
    //checkCollision();
    stage.update();
}

window.onload = function () {
    init();
};