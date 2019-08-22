from flask import Flask
from flask_socketio import SocketIO


socketio = SocketIO()

def create_app(debug=False):
    app = Flask(__name__)
    app.debug = debug
    app.config['SECRET_KEY'] = 'secret key'

    from .chess import chess as chess_bp
    app.register_blueprint(chess_bp)

    socketio.init_app(app)
    return app
