from flask import session
from flask_socketio import emit, join_room, leave_room
from .. import socketio

@socketio.on('joined', namespace='/game')
def joined(message):
    room = session.get('room')
    join_room(room)
    emit('joined', {'msg': session.get('name') + ' has entered the game.', 'name': session.get('name'), 'color': session.get('color'), 'room': room}, broadcast=True, room=room)

@socketio.on('move', namespace='/game')
def handle_move(move):
    room = session.get('room')
    print(move)
    emit('move', move, broadcast=True, room=room)

@socketio.on('test', namespace='/game')
def tester(message):
    print(message)
    room = session.get('room')
    emit('test', {'msg': "This is only a test"}, broadcast=True, room=room)
