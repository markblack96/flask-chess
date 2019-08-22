// Yeah, bad name for the file.
var socket = io();
var serverGame;

socket.on('joingame', function(msg) {
    init(msg.game);
});

var init = function (serverGameState) {
    serverGame = serverGameState;
    socket.on('connect', function() {
        socket.emit('joined', {});
    });
    var config = {
        draggable: true,
        position: 'start',
        onDrop: onDrop,
    };

    board = new Chessboard('gameBoard', config);
    game = new Chess();

    // handles moves from opponent
    socket.on('move', function(msg) {
        game.move(msg);
        board.position(game.fen()); // where fen is the board's layout
    });
};

var onDrop = function(source, target) {
    var move = game.move({from: source, to: target, promotion: 'q'});
    if (move == null) {
        return 'snapback';
    } else {
        socket.emit('move', {move: move, gameId: serverGame.id, board: game.fen()});
    }
};

$(document).ready(init);
