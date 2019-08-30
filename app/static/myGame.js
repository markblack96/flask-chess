// Yeah, bad name for the file.
var socket;
var serverGame;
var playersInRoom = [];
var roomName;
var username, playerColor;


socket = io.connect('http://' + document.domain + ':' + location.port + '/game');
socket.on('connect', function() {
    // player first connects here, let's assign information
    socket.emit('joined', {});

});
// after we receive connect emit from server, we fire off a joined event.
// then, we get a joined event in return
socket.on('joined', function(msg) {
    // fire off init here?
    serverGameState = msg.game;
    playerColor = msg.color;
    init(serverGameState);
    $('body').append('<p>' + msg['msg'] +'</p>');
});

var init = function (serverGameState) {
    serverGame = serverGameState;
    var config = {
        draggable: true,
        position: serverGame.board ? serverGame.board : 'start', 
        onDrop: onDrop,
        onDragStart: onDragStart,
        onSnapEnd: onSnapEnd,
        orientation: playerColor
    };
    board = new Chessboard('gameBoard', config);
    game = serverGame.board ? new Chess(serverGame.board) : new Chess();
    // msg needs to include username and color
// handles moves from opponent
};

socket.on('move', function(msg) {
    game.move(msg.move);
    board.position(game.fen()); // fen is the board's layout
    console.log(msg);
});
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
};
var onSnapEnd = function() {
    board.position(game.fen());
};
$(document).ready(init);
