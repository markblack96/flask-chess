// Yeah, bad name for the file.
var socket;
var serverGame;
var playersInRoom = [];
var roomName;
var username, playerColor;

var init = function (serverGameState) {
    socket = io.connect('http://' + document.domain + ':' + location.port + '/game');
    socket.on('connect', function() {
        // player first connects here, let's assign information
        socket.emit('joined', {});
    });
    var config = {
        draggable: true,
        position: 'start',
        onDrop: onDrop,
        onDragStart: onDragStart,
        orientation: playerColor
    };

    socket.on('joined', function(msg) {
        console.log(msg);
        $('body').append('<p>Player joined</p><br><p>' + msg['msg'] +'</p>');
        // msg needs to include username and color
        username = msg.name;
        playerColor = msg.color;
        playersInRoom.push({'player': username, 'color': playerColor});
        fen = msg.gameState;
        board.position(fen);
        console.log(msg.gameState);
    });
// handles moves from opponent
    socket.on('move', function(msg) {
        game.move(msg.move);
        board.position(game.fen()); // fen is the board's layout
        console.log(msg);
    });

    socket.on('test', function(msg) {
        console.log(msg);
    });

    board = new Chessboard('gameBoard', config);
    game = new Chess();
};

var onDrop = function(source, target) {
    var move = game.move({from: source, to: target, promotion: 'q'});
    if (move == null) {
        return 'snapback';
    } else {
        socket.emit('move', {'move': move, 'fen': game.fen()});
	// board = game.fen()
    }
};

var onDragStart = function(source, piece, position, orientation) {
    if (game.game_over() === true ||
            (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (game.turn() === 'b' && piece.search(/^w/) !== -1) ||
            (game.turn() !== playerColor[0])) {
          return false;
        }
}
$(document).ready(init);
