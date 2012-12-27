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
var difficulties = { EASY: "EASY", HARD: "HARD" };
var difficulty = difficulties.EASY;
var level = 1;
var size = 0;
var score = 0;
var prevScore = 0;
var board;
var board2;
var modes = { MAIN: "MAIN", LEVEL: "LEVEL", GAME: "GAME" };
var submodes = { NONE: "NONE", ABOUT: "ABOUT", HELP: "HELP" };
var mode = modes.MAIN;
var submode = submodes.NONE;
var canvasDOM, menuDOM, levelDOM, doneDOM, helpDOM, aboutDOM;
var gameComplete;
var starOn = "img/star-on.png";
var starOff = "img/star-off.png";
var curRating = 0;

function populateStats() {
    var $toggle = $('.switch')[0];

    var toggleSwitch = new WinJS.UI.ToggleSwitch($toggle);

    if (difficulty === difficulties.EASY)
        toggleSwitch.checked = false;
    else if (difficulty === difficulties.HARD)
        toggleSwitch.checked = true;

    if (difficulty === difficulties.HARD)
        $('body').css('background-image', 'url("../img/hardbg.jpg")');
    else
        $('body').css('background-image', 'url("../img/preview3.jpg")');

    var $statBlocks = $('.stats');
    for (var i = 0; i < $statBlocks.length; i++) {
        if (i % 2 === 0) {
            difficulty === difficulties.EASY ? $($statBlocks[i]).css('background-color', 'skyblue') : $($statBlocks[i]).css('background-color', 'orange');
        } else {
            difficulty === difficulties.EASY ? $($statBlocks[i]).css('background-color', 'green') : $($statBlocks[i]).css('background-color', 'yellow');
        }
    }


    var stats = localStorage["stats"];
    if (!stats) {
        stats = {
            EASY: {
                RATING: new Array(11),
                TOP_SCORE: new Array(11),
                MIN_BLOCKS: new Array(11)
            },
            HARD: {
                RATING: new Array(11),
                TOP_SCORE: new Array(11),
                MIN_BLOCKS: new Array(11)
            }
        };
        localStorage["stats"] = JSON.stringify(stats);
    } else {
        stats = JSON.parse(stats);
    }

    var $stats = $('.stats');
    
    for (var i = 0; i < $stats.length; i++) {
        var statblock = $stats[i];

        //set up stars
        var rating = stats[difficulty].RATING[i];
        var $images = $(statblock).find('img');
        
        for (var j = 0; j < $images.length; j++) {
            var image = $images[j];
            if (rating === undefined) {
                image.src = starOff;
            } else if ((j + 1) > rating) {
                image.src = starOff;
            } else {
                image.src = starOn;
            }
        }
        
        //populate top score & min blocks
        var $data = $(statblock).find('td');
        var topScore = stats[difficulty].TOP_SCORE[i];
        var minBlocks = stats[difficulty].MIN_BLOCKS[i];
        topScore !== undefined ? $data[0].innerText = topScore : $data[0].innerText = "-";
        minBlocks !== undefined ? $data[1].innerText = minBlocks : $data[1].innerText = "-";
    }

}

function calculateStats() {
    var stats = JSON.parse(localStorage["stats"]);

    //look at blocks remaining
    //look at score
    //look at level number
    var levelIndex = level - 1;
    var prevMinBlocks = stats[difficulty].MIN_BLOCKS[levelIndex];
    var prevMaxScore = stats[difficulty].TOP_SCORE[levelIndex];

    if (numBlks < prevMinBlocks || prevMinBlocks === undefined || prevMinBlocks === null)
        stats[difficulty].MIN_BLOCKS[levelIndex] = numBlks;
    if (score > prevMaxScore || prevMaxScore === undefined || prevMaxScore === null)
        stats[difficulty].TOP_SCORE[levelIndex] = score;

    var ratio = numBlks / (size * size);
    var prevRating = stats[difficulty].RATING[levelIndex];
    curRating;
    
    if (ratio === 0)
        curRating = 5;
    else if (ratio < 0.05)
        curRating = 4;
    else if (ratio < 0.10)
        curRating = 3;
    else if (ratio < 0.15)
        curRating = 2;
    else if (ratio < 0.20)
        curRating = 1;
    else {
        curRating = 0;
    }

    if (curRating > prevRating || prevMinBlocks === undefined || prevMinBlocks === null)
        stats[difficulty].RATING[levelIndex] = curRating;

    localStorage["stats"] = JSON.stringify(stats);
}


Array.prototype.containsArray = function(val) {

    var hash = {};
    for (var i = 0; i < this.length; i++) {
        hash[this[i]] = i;
    }
    return hash.hasOwnProperty(val);
};

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

//saves the current state variables
function save() {
    localStorage["score"] = score;
    localStorage["prevScore"] = prevScore;
    localStorage["numBlks"] = numBlks;
    localStorage["level"] = level;
    localStorage["difficulty"] = difficulty;
    localStorage["size"] = size;
    localStorage["board"] = JSON.stringify(board);
    localStorage["board2"] = JSON.stringify(board2);
}

//this function will store the current state variables in a data file which will be loaded on resume
function quit() {
    save();
    score = 0;
    numBlks = 0;
    level = 0;
    size = 0;
    board = [];
    board2 = [];

    for (var i = stage.getNumChildren() - 1; i >= 0; i--) {
        var bmp = stage.getChildAt(i);
        if (bmp.type === "block")
            stage.removeChild(bmp);
    }


    transition(modes.LEVEL);
    //tear down everything
    //clear the stage
    //zero out variables

}

//resumes the last saved game
function resume() {
    //make sure localstorage data is defined
    //get data from save file
    //initialize variables
    if (localStorage["score"]) {
        score = parseInt(localStorage["score"]);
        prevScore = parseInt(localStorage["prevScore"]);
        numBlks = parseInt(localStorage["numBlks"]);
        level = parseInt(localStorage["level"]);
        difficulty = localStorage["difficulty"];
        size = parseInt(localStorage["size"]);
        board = JSON.parse(localStorage["board"]);
        board2 = JSON.parse(localStorage["board2"]);
        populateStats();
        transition(modes.GAME);
        initializeBlocks(true);
        drawGame();
        updatePositions();

    } else {
        console.log("No previously saved game in storage.");
    }

    //set up board
}

function about(toAbout) {
    audio5.play();
    if (toAbout)
        submode = submodes.ABOUT;
    else
        submode = submodes.NONE;
    drawScreen();
}

function help(toHelp) {
    audio5.play();
    if (toHelp)
        submode = submodes.HELP;
    else
        submode = submodes.NONE;
    drawScreen();
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

        boxDOM.x = 3000;
        boxDOM2.x = 3000;

    }

    if (!canvasDOM) {
        var $menu = $('#menu')[0];
        $menu.style.height = window.innerHeight - 50 + 'px';
        $menu.style.width = $menu.style.height;

        var $level = $('#level')[0];
        $level.style.height = $menu.style.height;
        $level.style.width = $menu.style.width;

        var $done = $('#done')[0];
        $done.style.height = "100px";
        $done.style.width = "100px";

        var $about = $('#about')[0];
        $about.style.height = $menu.style.height;
        $about.style.width = $menu.style.width;

        var $help = $('#help')[0];
        $about.style.height = $menu.style.height;
        $about.style.width = $menu.style.width;

        aboutDOM = new createjs.DOMElement($about);
        stage.addChild(aboutDOM);

        doneDOM = new createjs.DOMElement($done);
        stage.addChild(doneDOM);

        levelDOM = new createjs.DOMElement($level);
        stage.addChild(levelDOM);

        helpDOM = new createjs.DOMElement($help);
        stage.addChild(helpDOM);

        menuDOM = new createjs.DOMElement($menu);
        stage.addChild(menuDOM);
        
        canvasDOM = new createjs.DOMElement(canvas);
        stage.addChild(canvasDOM);

        levelDOM.x = 3000;
        aboutDOM.y = -3000;
        helpDOM.y = 6000;
        canvasDOM.x = 3000;

    }

    menuDOM.htmlElement.style.height = window.innerHeight - 50 + 'px';
    menuDOM.htmlElement.style.width = menuDOM.htmlElement.style.height;

    aboutDOM.htmlElement.style.height = menuDOM.htmlElement.style.height;
    aboutDOM.htmlElement.style.width = menuDOM.htmlElement.style.width;

    helpDOM.htmlElement.style.height = menuDOM.htmlElement.style.height;
    helpDOM.htmlElement.style.width = menuDOM.htmlElement.style.width;

    doneDOM.htmlElement.style.height = "150px";
    doneDOM.htmlElement.style.width = canvas.width + 'px';

    levelDOM.htmlElement.style.height = menuDOM.htmlElement.style.height;
    levelDOM.htmlElement.style.width = menuDOM.htmlElement.style.width;

    boxDOM.htmlElement.style.height = canvas.height + 'px';
    boxDOM2.htmlElement.style.height = canvas.height + 'px';
        
    if (mode === modes.MAIN && submode === submodes.ABOUT) {
        createjs.Tween.get(menuDOM).to({ alpha: 1, x: $(canvas.parentElement).width() / 2 - $(menuDOM.htmlElement).width() / 2, y: $(canvas.parentElement).width() + 200, rotation: 0 }, 1000, createjs.Ease.cubicOut);
        createjs.Tween.get(aboutDOM).to({ alpha: 1, x: $(canvas.parentElement).width() / 2 - $(menuDOM.htmlElement).width() / 2, y: 25, rotation: 0 }, 1000, createjs.Ease.cubicOut);
    } else if (mode === modes.MAIN && submode === submodes.HELP) {
        createjs.Tween.get(menuDOM).to({ alpha: 1, x: $(canvas.parentElement).width() / 2 - $(menuDOM.htmlElement).width() / 2, y: -200 - $(canvas.parentElement).width(), rotation: 0 }, 1000, createjs.Ease.cubicOut);
        createjs.Tween.get(helpDOM).to({ alpha: 1, x: $(canvas.parentElement).width() / 2 - $(menuDOM.htmlElement).width() / 2, y: 25, rotation: 0 }, 1000, createjs.Ease.cubicOut);
    }
    else if (mode === modes.MAIN) {
        createjs.Tween.get(canvasDOM).to({ alpha: 1, x: $(canvas.parentElement).width() + 100, y: 25, rotation: 0 }, 50, createjs.Ease.cubicOut);
        createjs.Tween.get(levelDOM).to({ alpha: 1, x: $(canvas.parentElement).width() + 100, y: 25, rotation: 0 }, 2000, createjs.Ease.cubicOut);
        createjs.Tween.get(boxDOM).to({ alpha: .75, x: $(boxDOM.htmlElement.parentElement).width() + 100, y: 25, rotation: 0 }, 50, createjs.Ease.cubicOut);
        createjs.Tween.get(boxDOM2).to({ alpha: .75, x: $(boxDOM2.htmlElement.parentElement).width() + 100, y: 25, rotation: 0 }, 50, createjs.Ease.cubicOut);
        createjs.Tween.get(menuDOM).to({ alpha: 1, x: $(canvas.parentElement).width() / 2 - $(menuDOM.htmlElement).width() / 2, y: 25, rotation: 0 }, 2000, createjs.Ease.cubicOut);
        createjs.Tween.get(doneDOM).to({ alpha: 0, visible: false, x: $(canvas.parentElement).width() / 2 - canvas.width / 2, y: 0, rotation: 0 }, 50, createjs.Ease.cubicOut);
        createjs.Tween.get(aboutDOM).to({ alpha: 1, x: $(canvas.parentElement).width() / 2 - $(menuDOM.htmlElement).width() / 2, y: -200 - $(canvas.parentElement).width(), rotation: 0 }, 1000, createjs.Ease.cubicOut);
        createjs.Tween.get(helpDOM).to({ alpha: 1, x: $(canvas.parentElement).width() / 2 - $(menuDOM.htmlElement).width() / 2, y: $(canvas.parentElement).width() + 200, rotation: 0 }, 1000, createjs.Ease.cubicOut);
    }

    if (mode === modes.LEVEL) {
        createjs.Tween.get(canvasDOM).to({ alpha: 1, x: $(canvas.parentElement).width() + 100, y: 25, rotation: 0 }, 2000, createjs.Ease.cubicOut);
        createjs.Tween.get(boxDOM).to({ alpha: .75, x: $(boxDOM.htmlElement.parentElement).width() + 100, y: 25, rotation: 0 }, 2000, createjs.Ease.cubicOut);
        createjs.Tween.get(boxDOM2).to({ alpha: .75, x: $(boxDOM2.htmlElement.parentElement).width() + 100, y: 25, rotation: 0 }, 2000, createjs.Ease.cubicOut);
        createjs.Tween.get(doneDOM).to({ alpha: 0, visible: false, x: $(canvas.parentElement).width() / 2 - canvas.width / 2, y: 0, rotation: 0 }, 50, createjs.Ease.cubicOut);
        createjs.Tween.get(menuDOM).to({ alpha: 1, x: -$(menuDOM.htmlElement).width() - 300, y: 25, rotation: 0 }, 2000, createjs.Ease.cubicOut);
        createjs.Tween.get(levelDOM).to({ alpha: 1, x: $(canvas.parentElement).width() / 2 - $(levelDOM.htmlElement).width() / 2, y: 25, rotation: 0 }, 2000, createjs.Ease.cubicOut);
    }

    if (mode === modes.GAME && submode === submodes.HELP) {
        createjs.Tween.get(canvasDOM).to({ alpha: 1, x: $(canvas.parentElement).width() / 2 - canvas.width / 2, y: -200 - $(canvas.parentElement).width(), rotation: 0 }, 2000, createjs.Ease.cubicOut);
        createjs.Tween.get(boxDOM).to({ alpha: .75, x: $(boxDOM.htmlElement.parentElement).width() / 2 - canvas.width / 2 - $(boxDOM.htmlElement).width(), y: -200 - $(canvas.parentElement).width(), rotation: 0 }, 2000, createjs.Ease.cubicOut);
        createjs.Tween.get(boxDOM2).to({ alpha: .75, x: $(boxDOM2.htmlElement.parentElement).width() / 2 + canvas.width / 2, y: -200 - $(canvas.parentElement).width(), rotation: 0 }, 2000, createjs.Ease.cubicOut);
        createjs.Tween.get(doneDOM).to({ alpha: 0, visible: false, x: $(canvas.parentElement).width() / 2 - canvas.width / 2, y: 0, rotation: 0 }, 2000, createjs.Ease.cubicOut);
        createjs.Tween.get(helpDOM).to({ alpha: 1, x: $(canvas.parentElement).width() / 2 - $(menuDOM.htmlElement).width() / 2, y: 25, rotation: 0 }, 2000, createjs.Ease.cubicOut);
    } else if (mode === modes.GAME) {
        createjs.Tween.get(canvasDOM).to({ alpha: 1, x: $(canvas.parentElement).width() / 2 - canvas.width / 2, y: 25, rotation: 0 }, 2000, createjs.Ease.cubicOut);
        createjs.Tween.get(boxDOM).to({ alpha: .90, x: $(boxDOM.htmlElement.parentElement).width() / 2 - canvas.width / 2 - $(boxDOM.htmlElement).width(), y: 25, rotation: 0 }, 2000, createjs.Ease.cubicOut);
        createjs.Tween.get(boxDOM2).to({ alpha: .90, x: $(boxDOM2.htmlElement.parentElement).width() / 2 + canvas.width / 2, y: 25, rotation: 0 }, 2000, createjs.Ease.cubicOut);
        createjs.Tween.get(menuDOM).to({ alpha: 1, x: -$(menuDOM.htmlElement).width() - 300, y: 25, rotation: 0 }, 2000, createjs.Ease.cubicOut);
        createjs.Tween.get(levelDOM).to({ alpha: 1, x: -$(menuDOM.htmlElement).width() - 300, y: 25, rotation: 0 }, 2000, createjs.Ease.cubicOut);
        createjs.Tween.get(doneDOM).to({ alpha: 0, visible: false, x: $(canvas.parentElement).width() / 2 - canvas.width / 2, y: 0, rotation: 0 }, 2000, createjs.Ease.cubicOut);
        createjs.Tween.get(helpDOM).to({ alpha: 1, x: $(canvas.parentElement).width() / 2 - $(menuDOM.htmlElement).width() / 2, y: $(canvas.parentElement).width() + 200, rotation: 0 }, 2000, createjs.Ease.cubicOut);
    }
    //end game mode draw
}

function transition(nextMode) {
    mode = nextMode;
    if (mode === modes.LEVEL) {
        populateStats();
        audio3.pause();
        audio5.play();
        $('#stars').html('');
    }
    if (mode === modes.GAME) {
        audio5.play();
        audio3.src = audioSources[audioIndex];
        audio3.play();
    }
    drawScreen();
}

function updateMenus() {
    var $score = document.getElementById("score");
    $score.innerText = score;

    var $numBlks = document.getElementById("numBlks");
    $numBlks.innerText = numBlks;

    var $level = document.getElementById("numLevel");
    $level.innerText = level;

    var $size = document.getElementById("size");
    $size.innerText = size + " x " + size;

    var $difficulty = document.getElementById("difficulty");
    $difficulty.innerText = difficulty;
}

window.onresize = function() {
    drawScreen();
    drawGame();
};
//start screen
//levels menu
//top scores for each level
//load proper board

//board logic
//pull beads down and push to left

var audio = new Audio();
var audio2 = new Audio();
var audio3 = new Audio();
var audio4 = new Audio();
var audio5 = new Audio();

var audioSources = ["snd/destination.mp3", "snd/iron-man.mp3", "snd/midnight-ride.mp3", "snd/heart-of-the-sea.mp3"];
var audioIndex = Math.floor((Math.random() * audioSources.length));;

audio.src = "snd/button-1.mp3";
audio2.src = "snd/button-4.mp3";
audio4.src = "snd/button-37.mp3";
audio5.src = "snd/button-43.mp3";

audio.volume = 0.5;
audio2.volume = 0.5;
audio4.volume = 1;

function nextSong() {
    audioIndex++;
    if (audioIndex > audioSources.length - 1)
        audioIndex = 0;
    audio3.src = audioSources[audioIndex];
    playPause();
}

audio3.addEventListener('ended', function () {
    nextSong();
});

function playPause() {
    if (audio3.paused) {
        audio3.play();
        $('#playpause').children('img').attr('src', 'img/pause_small.png');
        $('#playpause').next().text("PAUSE");
    }
    else {
        audio3.pause();
        $('#playpause').children('img').attr('src', 'img/play_small.png');
        $('#playpause').next().text("PLAY");
    }
        
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

function handleImageLoad() {
    startGame();
}

function handleImageError(e) {
    console.log("Error loading image : " + e.target.src);
}

var spriteSheet;

//function slideIn() {
  //  $(canvas).animate({ left: canvas.parentElement.clientWidth / 2 - canvas.width / 2 + 8 + 'px' }, 2000);
//}

function startGame() {
    drawScreen();

    screen_width = canvas.width;
    screen_height = canvas.height;
        
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

function setDifficulty() {
    if (difficulty === difficulties.EASY)
        difficulty = difficulties.HARD;
    else
        difficulty = difficulties.EASY;

    populateStats();

}

WinJS.Utilities.markSupportedForProcessing(setDifficulty);
WinJS.Utilities.requireSupportedForProcessing(setDifficulty);

window.onload = function () {
    init();
};