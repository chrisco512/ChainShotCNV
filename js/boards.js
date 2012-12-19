var boardDirectory = [];

$.get('boards.txt', handleData);

function handleData(data) {
    data = data.split("\n");

    for (var i = 0; i < data.length; i++) {
        var size = parseInt(data[i], 10);

        //push an array to hold this board's data
        boardDirectory.push(new Array());

        //push a blank array representing each column of the current board
        for (var j = 0; j < size; j++) {
            boardDirectory[boardDirectory.length-1].push(new Array());
        }

        //populate the data
        for (var j = i + size; j > i; j--) {
            for (var k = 0; k < size; k++) {
                var char = data[j].charAt(k);
                boardDirectory[boardDirectory.length-1][k].push(char);
            }
        }

        i = i + size;
    }
}