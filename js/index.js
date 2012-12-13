var score;
var canvas;
var stage;
var screen_width;
var screen_height;
var bmps;
var boxDOM, boxDOM2;
var clickEnabled = true;
var images;
var numBlks = 0;
var mode = "EASY";
var level = 1;
var size = 0;
var score = 0;
var prevScore = 0;
var board = [["Y", "Y", "B", "O", "Y", "B", "O", "G", "B", "G", "B"], ["Y", "O", "B", "Y", "B", "O", "Y", "B", "O"], ["R", "G", "B", "G", "B", "G", "B"], ["R", "G", "B", "G", "B", "G", "B", "G", "B"], ["Y", "Y", "B", "O", "G", "B", "G", "B", "G", "B"], ["Y", "O", "Y", "B", "O", "B", "Y", "B", "O", "Y", "O"], ["R", "G", "B", "G", "B", "G", "B", "G", "B"], ["R", "G", "B", "G", "B", "G", "B", "G", "B"], ["Y", "O", "B", "G", "B", "G", "B", "G", "B"], ["Y", "Y", "B", "O"], ["Y", "Y", "B", "O"]];
var board2 = [["Y", "Y", "B", "O", "Y", "B", "O", "G", "B", "G", "B"], ["Y", "O", "B", "Y", "B", "O", "Y", "B", "O"], ["R", "G", "B", "G", "B", "G", "B"], ["R", "G", "B", "G", "B", "G", "B", "G", "B"], ["Y", "Y", "B", "O", "G", "B", "G", "B", "G", "B"], ["Y", "O", "Y", "B", "O", "B", "Y", "B", "O", "Y", "O"], ["R", "G", "B", "G", "B", "G", "B", "G", "B"], ["R", "G", "B", "G", "B", "G", "B", "G", "B"], ["Y", "O", "B", "G", "B", "G", "B", "G", "B"], ["Y", "Y", "B", "O"], ["Y", "Y", "B", "O"]];

Array.prototype.containsArray = function (val) {
    
    var hash = {};
    for (var i = 0; i < this.length; i++) {
        hash[this[i]] = i;
    }
    return hash.hasOwnProperty(val);
}

//sorts removes so that board clears out correctly
function sortRemoveList(a, b) {
    if (a[1] < b[1])
        return 1;
    else if (a[1] === b[1]) {
        if (a[0] < b[0])
            return 1;
        if (a[0] === b[0])
            return 0;
        else
            return -1;
    }
    else
        return -1;
}

function drawScreen() {
    
    canvas.height = window.innerHeight - 50;
    canvas.width = canvas.height;

    //canvas.style.left = canvas.parentElement.clientWidth / 2 - canvas.width / 2 + 8 + 'px';

    if (!boxDOM) {
        var box = document.getElementById("box");
        box.style.height = canvas.height + 'px';

        var box2 = document.getElementById("box2");
        box2.style.height = canvas.height + 'px';

        var container = document.getElementById("container");
        container.removeChild(canvas);
        container.appendChild(box);
        container.appendChild(box2);
        container.appendChild(canvas);

        boxDOM = new createjs.DOMElement(box);
        boxDOM2 = new createjs.DOMElement(box2);

        boxDOM.regX = boxDOM.width / 2;
        boxDOM.regY = boxDOM.height / 2;

        boxDOM2.regX = boxDOM2.width / 2;;
        boxDOM2.regY = boxDOM2.height / 2;;

        boxDOM.x = canvas.width * 0.5;
        boxDOM.y = -200;

        boxDOM2.x = canvas.width * 0.5;
        boxDOM2.y = -200;

        stage.addChild(boxDOM);
        stage.addChild(boxDOM2);

    }

    var $rand = $('#menu')[0];
    var createRand = new createjs.DOMElement($rand);
    stage.addChild(createRand);

    var canvasDOM = new createjs.DOMElement(canvas);
    stage.addChild(canvasDOM);

    createjs.Tween.get(canvasDOM).to({ alpha: 1, x: canvas.parentElement.clientWidth / 2 - canvas.width / 2, y: 0, rotation: 0 }, 20, createjs.Ease.cubicOut);

    boxDOM.htmlElement.style.height = canvas.height + 'px';
    boxDOM2.htmlElement.style.height = canvas.height + 'px';

    createjs.Tween.get(boxDOM).to({ alpha: .7, x: boxDOM.htmlElement.parentElement.clientWidth / 2 - canvas.width / 2 - boxDOM.htmlElement.clientWidth, y: 0, rotation: 360 }, 20, createjs.Ease.cubicOut);
    createjs.Tween.get(boxDOM2).to({ alpha: .7, x: boxDOM2.htmlElement.parentElement.clientWidth / 2 + canvas.width / 2, y: 0, rotation: 360 }, 20, createjs.Ease.cubicOut);
}

function updateMenus() {
    var $score = document.getElementById("score");
    $score.innerText = score;

    var $numBlks = document.getElementById("numBlks");
    $numBlks.innerText = numBlks;

    var $level = document.getElementById("level");
    $level.innerText = level;

    var $size = document.getElementById("size");
    $size.innerText = size + " x " + size;

    var $mode = document.getElementById("mode");
    $mode.innerText = mode;
}

window.onresize = function (event) {
    drawScreen();
    drawGame();
}
//start screen
//levels menu
//top scores for each level
//load proper board

//board logic
//pull beads down and push to left

var audio = new Audio();
var audio2 = new Audio();
var audio3 = new Audio();

var audioSources = ["snd/destination.mp3", "snd/iron-man.mp3", "snd/midnight-ride.mp3", "snd/heart-of-the-sea.mp3"];
var audioIndex = Math.floor((Math.random() * audioSources.length));;

audio.src = "snd/button-1.mp3";
audio2.src = "snd/button-4.mp3";
audio.volume = 0.5;
audio2.volume = 0.5;
audio3.autoplay = true;
//audio3.src = audioSources[audioIndex];

function nextSong() {
    audioIndex++;
    if (audioIndex > audioSources.length - 1)
        audioIndex = 0;
    audio3.src = audioSources[audioIndex];
}

audio3.addEventListener('ended', function () {
    nextSong();
});

function playPause() {
    if (audio3.paused)
        audio3.play();
    else
        audio3.pause();
}

function init() {

    canvas = document.getElementById("gameCanvas");

    stage = new createjs.Stage(canvas);

    drawScreen();
    drawGame();

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

var spriteSheet;

function slideIn() {
    $(canvas).animate({ left: canvas.parentElement.clientWidth / 2 - canvas.width / 2 + 8 + 'px' }, 2000);
}

function startGame() {
    drawScreen();

    screen_width = canvas.width;
    screen_height = canvas.height;

    initializeBlocks();

    
    stage.update();
    createjs.Ticker.addListener(window);
    createjs.Ticker.useRAF = true;
    createjs.Ticker.setFPS(60);

    drawScreen();
}



// not really checking collision, but checking to see if the block is in the proper position or not
function checkCollision(bmp) {
    if (bmp.x < bmp.properX) {
        bmp.x = bmp.properX;
    }

    if (bmp.y > bmp.properY ) {
        bmp.y = bmp.properY; 
    }
}



window.onload = function () {
    init();
};