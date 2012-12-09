
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
var target;

var clickEnabled = true;

var images;
var board = [["R", "R", "G"], ["R", "G", "B"], ["Y", "Y", "B", "O"], ["Y", "O", "B"], ["R", "G", "B"], ["R", "G", "B"], ["Y", "O", "B"], ["Y", "Y", "B", "O"], ["Y", "Y", "B", "O"]];


function init() {
    canvas = document.getElementById("gameCanvas");

    images = new Image();
    images.onload = handleImageLoad;
    images.onerror = handleImageError;
    images.src = "img/jewelSheet.png";
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

    var spriteSheet = new createjs.SpriteSheet({
        images: [images],
        frames: { width: 150, height: 150, regX: 75, regY: 75 },
        animations: {
            A: [0, 0, false],
            A_I:[0, 1, "A_I", 4],
            B:  [2, 2, false],
            B_I:[2, 3, "B_I", 4],
            C:  [4, 4, false],
            C_I:[4, 5, "C_I", 4],
            D:  [6, 6, false],
            D_I:[6, 7, "D_I", 4],
            E:  [8, 8, false],
            E_I:[8, 9, "E_I", 4],
            F:  [10, 10, false],
            F_I:[10, 11, "F_I", 4],
            G:  [12, 12, false],
            G_I:[12, 13, "G_I", 4],
            H:  [14, 14, false],
            H_I:[14, 15, "H_I", 4],
            I:  [16, 16, false],
            I_I:[16, 17, "I_I", 4],
            J:  [18, 18, false],
            J_I:[18, 19, "J_I", 4],
            K:  [20, 20, false],
            K_I:[20, 21, "K_I", 4],
            L:  [22, 22, false],
            L_I:[22, 23, "L_I", 4],
            O:  [24, 24, false],
            O_I:[24, 25, "O_I", 4],
            P:  [26, 26, false],
            P_I:[26, 27, "P_I", 4],
            R:  [28, 28, false],
            R_I:[28, 29, "R_I", 4],
            Y:  [30, 30, false],
            Y_I:[30, 31, "Y_I", 4],
        }
    });

    //bmps = new createjs.BitmapAnimation(spriteSheet);
    //
    //bmps.onClick = handleClick;
    //
    //bmps.gotoAndPlay("B");
    //
    //bmps.x = 300;
    //bmps.y = 300;
    //
    //bmps.currentFrame = 0;
    //
    //stage.addChild(bmps);

    bmps = new Array(board.length);
    
    for (var i = 0; i < board.length; i++) {
        bmps[i] = new Array(board[i].length);
        for (var j = 0; j < board[i].length; j++) {
            var bmp = new createjs.BitmapAnimation(spriteSheet);
            bmp.gotoAndPlay(board[i][j]);

            bmp.currentFrame = 0;
            
            bmp.onClick = handleClick;
            
            //bmp.regX = bmp.spriteSheet._frameWidth / 2;
            //bmp.regY = bmp.spriteSheet._frameHeight / 2;
       
            bmp.scaleX = (screen_width / board.length) / bmp.spriteSheet._frameWidth;
            bmp.scaleY = (screen_height / board.length) / bmp.spriteSheet._frameHeight;
    
            bmp.x = (bmp.spriteSheet._frameWidth / 2 + i * bmp.spriteSheet._frameWidth) * bmp.scaleX;
            bmp.y = screen_height - bmp.scaleY * (bmp.spriteSheet._frameHeight / 2 + j * bmp.spriteSheet._frameHeight);
    
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
    //bmps.vX = -25;
    //bmps.vY = 25;
    //bmps.properX = 20;
    //bmps.properY = 540;
    //bmp.shadow = new createjs.Shadow("#454", 0, 5, 4);

    
    stage.update();
    //
    createjs.Ticker.addListener(window);
    createjs.Ticker.useRAF = true;
    createjs.Ticker.setFPS(60);
}

function checkCollision() {

    if (bmps.x < (bmps.properX + bmps.spriteSheet._frameHeight / 2)) {
        bmps.x = bmps.properX + bmps.spriteSheet._frameHeight / 2;
    }

    if (bmps.y > (bmps.properY - bmps.spriteSheet._frameHeight / 2)) {
        bmps.y = bmps.properY - bmps.spriteSheet._frameHeight / 2;
    }
}

function fadeOut() {
    if (target.alpha > 0)
        target.alpha -= 0.03;
    else {
        target.gotoAndStop(target.currentAnimation.substring(0,1));
        target.alpha = 1;
        createjs.Ticker.removeListener(fadeOut);
        clickEnabled = true;
    }
}

function handleClick(e) {
    if (clickEnabled) {
        clickEnabled = false;
        target = e.target;
        target.gotoAndPlay(target.currentAnimation + "_I");
        createjs.Ticker.addListener(fadeOut);
    }
}

function tick() {
    //bmps.x += bmps.vX;
    //bmps.y += bmps.vY;
    //checkCollision();
    stage.update();
}

window.onload = function () {
    init();
};