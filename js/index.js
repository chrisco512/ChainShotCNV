
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

var clickEnabled = true;

var images;
var board = [["R", "R", "G"], ["R", "G", "B"], ["Y", "Y", "B", "O"], ["R", "R", "G"], ["R", "G", "B"], ["Y", "Y", "B", "O"], ["R", "R", "G"], ["R", "G", "B"], ["Y", "Y", "B", "O"], ["Y", "O", "B"], ["R", "G", "B"], ["R", "G", "B"], ["Y", "O", "B"], ["Y", "Y", "B", "O"], ["Y", "Y", "B", "O"]];


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

    // set up animations
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
    
    //add bead animations to the stage
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var bmp = new createjs.BitmapAnimation(spriteSheet);
            bmp.gotoAndPlay(board[i][j]);

            bmp.currentFrame = 0;
            
            bmp.onClick = handleClick;
       
            bmp.scaleX = (screen_width / board.length) / bmp.spriteSheet._frameWidth;
            bmp.scaleY = (screen_height / board.length) / bmp.spriteSheet._frameHeight;
    
            bmp.x = (bmp.spriteSheet._frameWidth / 2 + i * bmp.spriteSheet._frameWidth) * bmp.scaleX;
            bmp.y = screen_height - bmp.scaleY * (bmp.spriteSheet._frameHeight / 2 + j * bmp.spriteSheet._frameHeight);

            bmp.properX = bmp.x;
            bmp.properY = bmp.y;

            bmp.i = i;
            bmp.j = j;
    
            stage.addChild(bmp);
        }
    }
    
    stage.update();
    createjs.Ticker.addListener(window);
    createjs.Ticker.useRAF = true;
    createjs.Ticker.setFPS(60);
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

var fadeBmps;

// causes the block to fade awaay as it plays its removal animation
function fadeOut() {
    var invisibleCount = 0;

    for (var i = 0; i < fadeBmps.length; i++) {
        var bmp = fadeBmps[i];
        if (bmp.alpha > 0)
            bmp.alpha -= 0.03;
        else {
            invisibleCount++;
        }
    }

    if (invisibleCount === fadeBmps.length) {
        for (var i = 0; i < fadeBmps.length; i++) {
            var bmp = fadeBmps[i];
            stage.removeChild(bmp);
            board[bmp.i].splice(bmp.j, 1);
            if (board[bmp.i].length === 0)
                board.splice(bmp.i, 1);
        }

        updatePositions();
        createjs.Ticker.removeListener(fadeOut);
        clickEnabled = true;
    }   
}

// sets the "proper" coordinates so the block knows what position to move towards after others have been removed
function updatePositions() {
    var counter = 0;

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var bmp = stage.getChildAt(counter);

            bmp.properX = (bmp.spriteSheet._frameWidth / 2 + i * bmp.spriteSheet._frameWidth) * bmp.scaleX;
            bmp.properY = screen_height - bmp.scaleY * (bmp.spriteSheet._frameHeight / 2 + j * bmp.spriteSheet._frameHeight);

            bmp.i = i;
            bmp.j = j;

            counter++;
        }
    }
}

// when a block gets clicked, disable the click function until the block has been removed
function handleClick(e) {
    if (clickEnabled) {
        clickEnabled = false;
        remove(e.target);
    }
}

// remove blocks
function remove(target) {
    var removeList = [];
    var visitList = [];
    var visitedList = [];
    fadeBmps = [];

    removeList.push([target.i, target.j]);
    visitList.push([target.i, target.j]);

    var curColor = board[target.i][target.j];

    while (visitList.length > 0) {
        var currentNode = visitList.pop();
        var curCol = currentNode[0];
        var curRow = currentNode[1];

        var leftColor = curCol > 0 ? board[curCol - 1][curRow] : null;
        var leftNode = [curCol - 1, curRow];

        var topColor = curRow < board[curCol].length - 1 ? board[curCol][curRow + 1] : null;
        var topNode = [curCol, curRow + 1];

        var rightColor = curCol < board.length - 1 ? board[curCol + 1][curRow] : null;
        var rightNode = [curCol + 1, curRow];

        var bottomColor = curRow > 0 ? board[curCol][curRow - 1] : null;
        var bottomNode = [curCol, curRow - 1];

        //check left node
        if (leftColor === curColor) {
            if (!visitedList.containsArray(leftNode) && !visitList.containsArray(leftNode)) {
                removeList.push(leftNode);
                visitList.push(leftNode);
            }
        }
        //check top node
        if (topColor === curColor) {
            if (!visitedList.containsArray(topNode) && !visitList.containsArray(topNode)) {
                removeList.push(topNode);
                visitList.push(topNode);
            }
        }
        //check right node
        if (rightColor === curColor) {
            if (!visitedList.containsArray(rightNode) && !visitList.containsArray(rightNode)) {
                removeList.push(rightNode);
                visitList.push(rightNode);
            }

        }
        //check bottom node
        if (bottomColor === curColor) {
            if (!visitedList.containsArray(bottomNode) && !visitList.containsArray(bottomNode)) {
                removeList.push(bottomNode);
                visitList.push(bottomNode);
            }
        }

        visitedList.push(currentNode);
    }

    removeList.sort(sortRemoveList);

    if (removeList.length > 1) {
        // set up remove animations for each in the remove list
        var stageIndex = stage.getNumChildren() - 1;

        for (var i = board.length - 1; i >= 0; i--) {
            for (var j = board[i].length - 1; j >= 0; j--) {
                for (var k = 0; k < removeList.length; k++) {
                    if (removeList[k][0] === i && removeList[k][1] === j) {
                        var bmp = stage.getChildAt(stageIndex);
                        bmp.gotoAndPlay(bmp.currentAnimation + "_I");
                        fadeBmps.push(bmp);
                    }
                }
                stageIndex--;
            }
        }

        createjs.Ticker.addListener(fadeOut);
    } else {
        clickEnabled = true;
    }

    //animations in single array
    //data is in a double array

    //iterate through board array with a counter to translate to position, yes, easiest way
    //

}

// pull blocks toward proper position
function tick() {
    for (child in stage.children) {
        stage.children[child].x -= 5;
        stage.children[child].y += 5;
        checkCollision(stage.children[child]);
    }
    stage.update();
}

window.onload = function () {
    init();
};