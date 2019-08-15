// Yeah, bad name for the file.

var init = function () {
    var config = {
        draggable: true,
        position: 'start',
        onDrop: handleMove,
    };

    board = new Chessboard('gameBoard', config);
    game = new Chess();
}

var handleMove = function(source, target) {
    var move = game.move({from: source, to: target});
}

$(document).ready(init);
