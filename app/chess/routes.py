from flask import render_template, url_for, session, redirect, request
from . import chess
from .forms import LoginForm

@chess.route('/', methods=['GET', 'POST'])
def index():
    form = LoginForm()
    if form.validate_on_submit():
        session['name'] = form.name.data
        session['room'] = form.room.data
        session['color'] = form.color.data
        return redirect(url_for('.game'))
    elif request.method == 'GET':
        form.name.data = session.get('name', '')
        form.room.data = session.get('room', '')
    return render_template("index.html", form=form) 

@chess.route('/game')
def game():
    name = session.get('name', '')
    room = session.get('room', '')
    color = session.get('color', '')
    if name == '' or room == '':
        return redirect(url_for('.index'))
    return render_template('game.html', name=name, room=room)
