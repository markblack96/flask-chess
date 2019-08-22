from app import create_app, socketio


app = create_app(debug=True)
# we apparently need this for testing
if __name__ == '__main__':
    socketio.run(app) #app.run(debug=True, host="0.0.0.0")
