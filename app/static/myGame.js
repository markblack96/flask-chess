// Yeah, bad name for the file.
var socket;
var playersInRoom = [];
var roomName;
var username, playerColor;

var init = function (serverGameState) {
    socket = io.connect('http://' + document.domain + ':' + location.port + '/game');
    socket.on('connect', function() {
        // player first connects here, let's assign information
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
        // msg needs to include username and color
        username = msg.name;
        color = msg.color;
        playersInRoom.push({'player': username, 'color': playerColor});
        
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
