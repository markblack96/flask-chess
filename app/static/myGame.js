// Yeah, bad name for the file.
var socket;

var init = function (serverGameState) {
    socket = io.connect('http://' + document.domain + ':' + location.port + '/game');
    socket.on('connect', function() {
        socket.emit('joined', {});
        console.log('Confirmed connection'); // This one works???
    });
    var config = {
        draggable: true,
        position: 'start',
        onDrop: onDrop,
    };


    socket.on('joined', function(msg) {
        console.log(msg);
        $('body').append('<p>Player joined</p><br><p>' + msg['msg'] +'</p>');
    });
// handles moves from opponent
    socket.on('move', function(msg) {
        game.move(msg);
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
        socket.emit('move', move);
	// board = game.fen()
    }
};
$(document).ready(init);
