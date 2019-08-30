from flask import session
from flask_socketio import emit, join_room, leave_room
from . import players, games
from .. import socketio

@socketio.on('connect')
def connect():
    # send user info
    name = session.get('name')
    color = session.get('color')
    room = session.get('room')
    
    player_info = {'name': name, 'color': color,'room': room}
    players.append(player_info)
    
    game_players = []
    game_players.append(player_info)

    if next((g for g in games if g['room'] == room), None) is None:
        games.append({'room': room, 'board': '', 'players': game_players}) 
    else:
        next(g for g in games if g['room'] == room)['players'].append(player_info)
    emit('connect', player_info)

@socketio.on('joined', namespace='/game')
def joined(message):
    room = session.get('room')
    join_room(room)
    players.append({'name': session.get('name'), 'game': room})
    print(players)
    print(games)
    game_state = next(g for g in games if g['room'] == room)
    game = {
            'id': room,
            'board': game_state['board'],
            }
    # emit('joined', {'msg': session.get('name') + ' has entered the game.', 'name': session.get('name'), 'color': session.get('color'), 'room': room, 'board': game_state['board']}, broadcast=True, room=room)
    emit('joined', {'game': game,
        'color': session.get('color'),
        'name': session.get('name'),
        'msg': session.get('name') + ' has entered the game.'}
        )

@socketio.on('move', namespace='/game')
def handle_move(move):
    room = session.get('room')
    print(move)
    game_state = next(g for g in games if g['room'] == room)
    emit('move', {'room': room, 'move': move['move'], 'game': {'id': room, 'board': game_state['board']}}, broadcast=True, room=room)
    game = next(g for g in games if g['room'] == room)
    game['board'] = move['board']

