from flask import session
from flask_socketio import emit, join_room, leave_room
from . import players, games
from .. import socketio

@socketio.on('joined', namespace='/game')
def joined(message):
    room = session.get('room')
    join_room(room)
    players.append({'name': session.get('name'), 'game': room})
    if next((g for g in games if g['room'] == room), None) is None:
        games.append({'room': room, 'board': ''}) # todo: check uniqueness
    print(players)
    print(games)
    game_state = next(g for g in games if g['room'] == room)
    game = {
            'id': room,
            'board': game_state['board'],
            }
    # emit('joined', {'msg': session.get('name') + ' has entered the game.', 'name': session.get('name'), 'color': session.get('color'), 'room': room, 'board': game_state['board']}, broadcast=True, room=room)
    emit('joined', {'game': game, 'color': session.get('color'), 'name': session.get('name')}, broadcast=True, room=room)

@socketio.on('move', namespace='/game')
def handle_move(move):
    room = session.get('room')
    print(move)
    emit('move', move['move'], broadcast=True, room=room)
    game = next(g for g in games if g['room'] == room)
    game['board'] = move['fen']

